const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'ht'
const supabaseKey =
  '

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertData() {
  const { data, error } = await supabase.from('reports').upsert({
    description: 'report 1',
    image: 'https://example.com/image1.jpg',
    author: 'Author 1',
  })

  if (error) {
    console.error('Error inserting data:', error)
  } else {
    console.log('Data inserted successfully:', data)
  }
}

async function fetchData() {
  const { data, error } = await supabase.from('reports').select('*')
  if (error) {
    console.error('Error fetching data:', error)
  } else {
    console.log('Fetched data:', data)
  }
}
