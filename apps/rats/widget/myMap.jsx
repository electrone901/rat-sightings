const dataTemp = fetch('https://data.cityofnewyork.us/resource/3q43-55fe.json')
const resultData = dataTemp?.body

const dataDic = {}
// parse data
resultData.forEach((item) => {
  const obj = {
    address: item.incident_address,
    status: item.status,
    id: item.unique_key,
    lng: item.longitude,
    lat: item.latitude,
    descriptor: item.descriptor,
    incident_zip: item.incident_zip,
    x_coordinate_state_plane_: item.x_coordinate_state_plane_,
    created_date: item.created_date,
    city: item.city,
    intersection_street_1: item.intersection_street_1,
    landmark: item.landmark,
    y_coordinate_state_plane_: item.y_coordinate_state_plane_,
    agency_name: item.agency_name,
    location_type: item.location_type,
    cross_street_1: item.cross_street_1,
    community_board: item.community_board,
    agency: item.agency,
    park_borough: item.park_borough,
    borough: item.borough,
    street_name: item.street_name,
    complaint_type: item.complaint_type,
    address_type: item.address_type,
    intersection_street_2: item.intersection_street_2,
  }
  if (!dataDic[item.unique_key]) {
    dataDic[item.unique_key] = obj
    dataDic[item.unique_key].count = 1
  } else {
    dataDic[item.unique_key].count++
  }
})
// gets an ar of elements thats what we need to pass to our props
const cleanData = Object.values(dataDic)

// gets all markers  from /thing/reviewMarker
const markers = Social.get(`*/thing/reviewMarker`, 'final', {
  subscribe: 'true',
})

if (!markers) {
  return <></>
}
const dataMap = {}
Object.keys(markers).forEach((accountId) => {
  if (markers[accountId].thing && markers[accountId].thing.reviewMarker) {
    const markerObj = JSON.parse(markers[accountId].thing.reviewMarker)
    dataMap[accountId] = { accountId, ...markerObj }
  }
})
// sets the state
State.init({
  variant: '',
  title: '',
  open: false,
  isShowMore: false,
  img: '',
  locations: [],
  description: '',
  edit: false,
  currentLocation: (dataMap[accountId] && dataMap[accountId].coordinates) || {},
})
// prepares data to be post it
const handleSave = () => {
  const data = {
    post: {
      main: JSON.stringify({
        description: state.description,
        img: state.img,
        id: state.currentLocation.id,
      }),
    },
    index: {
      post: JSON.stringify({
        key: state.currentLocation.id,
        value: {
          type: 'md',
        },
      }),
    },
  }

  // post data to
  Social.set(data, {
    force: true,
    onCommit: () => {
      State.update({
        edit: false,
        showForm: false,
        showInspect: false,
        open: true,
        variant: 'success',
        title: 'Success!',
        description: 'Your review has been successfully save to the contract.',
      })
    },
    onCancel: () =>
      State.update({
        edit: false,
        showForm: false,
        showInspect: false,
        variant: error,
        open: true,
        title: 'Failed!',
        description:
          'We could not  save your review, please try one more time.',
      }),
  })
}

// IMAGEUPLOADER
const uploadFileUpdateState = (body) => {
  asyncFetch('https://ipfs.near.social/add', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body,
  }).then((res) => {
    const cid = res.body.cid
    State.update({ img: { cid } })
  })
}
const filesOnChange = (files) => {
  if (files) {
    State.update({ img: { uploading: true, cid: null } })
    uploadFileUpdateState(files[0])
  }
}

function Inspect(p) {
  const { Feed } = VM.require('devs.near/widget/Module.Feed')
  Feed = Feed || (() => <></>) // make sure you have this or else it can break

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '1rem',
        height: '750px',
        overflowY: 'scroll',
        paddingBottom: '5rem',
      }}
    >
      <h2>
        {p.address}, {p.city} , {p.incident_zip}
      </h2>

      <p style={{ fontSize: '14px' }}>
        <strong> Incident issue:</strong>
        {p.descriptor}
      </p>
      <p style={{ fontSize: '14px' }}>
        <strong> Incident status:</strong>
        {p.status}
      </p>

      <p style={{ paddingTop: '6px', fontSize: '14px' }}>
        <strong> Near to:</strong>
        {p.cross_street_2} {p.intersection_street_1}
      </p>
      <p style={{ paddingTop: '6px', fontSize: '14px' }}>
        <strong> Created date:</strong>
        {p.created_date}
      </p>
      <p style={{ paddingTop: '6px', fontSize: '14px' }}>
        <strong>Complaint type:</strong>
        {p.complaint_type}
      </p>

      <pre
        style={{ color: 'white' }}
        onClick={() => {
          State.update({ isShowMore: false })
        }}
      >
        {state.isShowMore ? (
          <button style={buttonBlueStyle}>See less</button>
        ) : (
          ''
        )}
      </pre>
      <pre
        style={{ backgroundColor: 'black', color: 'white' }}
        onClick={() => {
          State.update({ isShowMore: true })
        }}
      >
        {state.isShowMore ? JSON.stringify(p, null, 2) : 'Show all'}{' '}
      </pre>

      <h2 style={{ fontSize: '25px', fontWeight: 'bold' }}>Reviews</h2>
      <Feed
        index={{
          action: 'post',
          key: state.currentLocation.id,
          options: {
            limit: 10,
            order: 'desc',
            accountId: undefined,
          },
        }}
        Item={(p) => {
          const id = state.currentLocation.id
          return <Widget src="rats.near/widget/card" props={p} />
        }}
      />
    </div>
  )
}

function Form() {
  const buttonBlueStyle = {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
  const descriptionTextareaStyle = {
    width: '100%',
    height: '100px', // Adjust the height as needed
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  }

  const formTitleStyle = {
    fontSize: '24px',
    paddingTop: '1rem',
  }

  const descriptionInputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  }

  const saveButtonStyle = {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '1rem' }}>
      <h1 style={formTitleStyle}>Submit Ticket</h1>
      <div className="d-inline-block">
        {state.img ? (
          <img
            class="rounded w-100 h-100"
            style={{ objectFit: 'cover' }}
            src={`https://ipfs.near.social/ipfs/${state.img.cid}`}
            alt="upload preview"
          />
        ) : (
          ''
        )}
        <Files
          multiple={false}
          accepts={['image/*']}
          minFileSize={1}
          clickable
          className="btn btn-outline-primary"
          onChange={filesOnChange}
        >
          {state.img?.uploading ? <> Uploading </> : 'Upload an Image'}
        </Files>
      </div>

      <textarea
        style={descriptionTextareaStyle}
        placeholder="Enter description"
        value={description}
        onChange={(e) => State.update({ description: e.target.value })}
      ></textarea>
      <button style={saveButtonStyle} onClick={handleSave}>
        Save
      </button>
    </div>
  )
}

const toggleClosed = () => {
  State.update({ open: false, img: '', description: '' })
}
return (
  <div>
    <Widget
      src="map.near/widget/index"
      props={{
        markerAsset:
          'https://creazilla-store.fra1.digitaloceanspaces.com/emojis/57992/rat-emoji-clipart-md.png',
        reviewData: reviews,
        markers: cleanData,
        myMarkers: myData,
        onMapClick: (e) => console.log('map click', e),
        onMarkerClick: (e) => {
          // onclick pass address & query supabase, return everything from reports  where  address = passedAddress
          // get the data and display using reviews widget
          State.update({
            currentLocation: e,
          })
        },
        inspect: (p) => <Inspect {...p} />,
        form: (p) => <Form {...p} />,
      }}
    />

    {/* this widget comes from rats/widget/toast whenever you are ready to publish the widget it needs to be change so it referes to the correct publish widget, no longer the local widger. eg: byalbert.near/widget/toast  */}
    <Widget
      src="rats.near/widget/toast"
      props={{
        variant: state.variant,
        open: state.open,
        toggleClosed,
        title: state.title,
        description: state.description,
      }}
    />
  </div>
)
