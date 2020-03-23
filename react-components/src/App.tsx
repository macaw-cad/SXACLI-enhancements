import React from 'react';
// import { BasicFormExample } from './form-examples/BasicFormExample';
// import { StarWarsForm } from './formWrappers/StarsWarsForm';
import { OrganizationInformationForm } from './form-examples/OrganizationInformationForm'

function App() {
  return (
    // todo, get bootstrap css
    <div className="container" style={{maxWidth: '1000px', margin: '0 auto'}}>
      {/* <BasicFormExample /> */}
      <OrganizationInformationForm />
      {/* <StarWarsForm /> */}
    </div>
  );
}

export default App;