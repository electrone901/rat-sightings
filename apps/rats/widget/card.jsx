const { accountId, blockHeight } = props
const { img, description } = JSON.parse(
  Social.get(`${accountId}/post/main`, blockHeight) || 'null',
)
if (!description) {
  return <h2>No Reviews yet</h2>
}
return (
  <div
    style={{
      padding: '20px',
      border: '1px solid #e0e0e0',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: '50px',
          height: '50px',
          bordeRadius: '50%',
          overflow: 'hidden',
          marginRight: '10px',
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1361/1361913.png"
          alt="Author's Avatar"
          style={{ width: '90%', height: '90%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ fontSize: '21px', fontWeight: 'bold' }}>{accountId}</div>
    </div>
    <p
      style={{
        fontSize: '15px',
        textAlign: 'justify',
        letterSpacing: '1px',
        wordSpacing: '2px',
      }}
    >
      {description ? description : 'Not Reviews'}
    </p>
    <Widget
      src="mob.near/widget/Image"
      props={{
        image: {
          ipfs_cid: img.cid,
        },
        alt: 'profile background',
        className: 'w-100 h-100',
        style: { left: 0, top: 0 },
        // fallbackUrl:
        //   'https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm',
      }}
    />
  </div>
)
