import {Link} from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Page404 = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Helmet>
          <meta
              name="description"
              content={`page not found`}
          />
          <title>Page not found</title>
      </Helmet>
      <img 
        src="https://static.vecteezy.com/system/resources/previews/008/255/804/original/page-not-found-error-404-system-updates-uploading-computing-operation-installation-programs-system-maintenance-graffiti-sprayed-page-not-found-error-404-isolated-on-white-background-vector.jpg" 
        alt="Page not found" 
        style={{width: 500}}/>
      <Link 
        to=".."
        style={{display: 'block', textAlign: 'center', fontWeight: 'bold', 'fontSize': 38, textDecoration: 'underline', marginTop: 50, color: '#9F0013'}}>
          Back to main page</Link>
    </div>
  )
}

export default Page404

//How to import image from url in react component