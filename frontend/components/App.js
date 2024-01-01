// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import * as Yup from 'yup';

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

const schema = Yup.object().shape({
  username: Yup.string().required(e.usernameRequired).min(3, e.usernameMin).max(20, e.usernameMax),
  favLanguage: Yup.string().required(e.favLanguageRequired).oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: Yup.string().required(e.favFoodRequired).oneOf(['pizza', 'spaghetti', 'broccoli'], e.favFoodOptions),
  agreement: Yup.boolean().required(e.agreementRequired).oneOf([true], e.agreementOptions)
})

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [form, setForm] = useState({
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: false
  })

  const [error, setError] = useState({
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: ''
  })

  const [disableSubmit, setDisableSubmit] = useState(true)

  const [success, setSuccess] = useState('')

  const [failure, setFailure] = useState('')

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    schema.isValid(form).then(isValid => {
      setDisableSubmit(!isValid)
    });
  },[form])

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    let {type, checked, name, value} = evt.target;
    
    if (type === 'checkbox') value = checked;
    setForm({ ...form, [name]: value })
    Yup.reach(schema, name)
      .validate(value)
      .then(() => {
        setError({ ...error, [name]: '' })
      })
      .catch(err => {
        setError({ ...error, [name]: err.errors[0] })
      });
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault();
    setDisableSubmit(true)

    schema.validate(form)
      .then(data => {
        axios.post('https://webapis.bloomtechdev.com/registration', data)
          .then(result => {
            setSuccess(result.data.message)
            setFailure('')
            setForm({
              username: '',
              favLanguage: '',
              favFood: '',
              agreement: false
            })
          })
          .catch(error => {
            setFailure(error.response.data.message)
            setSuccess('')
            schema.isValid(form).then(isValid => {
              setDisableSubmit(!isValid)
            });
          })
      })
      .catch(error => {
        console.log(error)
      });
  }
    
  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit} onChange={onChange}>
        
        {success && <h4 className="success">{success}</h4>}
        {failure && <h4 className="error">{failure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" value={form.username} onChange={() => {}}/>
          {error.username && <div className="validation">{error.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" checked={form.favLanguage === "javascript"} readOnly={true}/>
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" checked={form.favLanguage === "rust"} readOnly={true}/>
              Rust
            </label>
          </fieldset>
          {error.favLanguage && <div className="validation">{error.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" value={form.favFood} readOnly={true}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {error.favFood && <div className="validation">{error.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" checked={form.agreement} readOnly={true}/>
            Agree to our terms
          </label>
          {error.agreement && <div className="validation">{error.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={disableSubmit} />
        </div>
      </form>
    </div>
  )
}
