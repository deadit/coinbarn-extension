import zxcvbn from 'zxcvbn';
import React from 'react';
import logo from '../../img/2screen/logo.jpg';
import back from '../../img/ui/back.png';
import back_dark from '../../img/ui/back_dark.png';
import PublicAccount from "../../PublicAccount";
import refresh from "../../img/ui/refresh.png";
import copy from "../../img/ui/copy.png";
import CoinbarnStorage from "../../CoinbarnStorage";
import {generateMnemonic} from "bip39";

export default class RegistrationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AccName: '',
      pass: '',
      confPass: '',
      screen: 'password',
      formErrors: {AccName: 'Account name is too short', pass: 'Passwords is too weak', confPass: '', checkbox: ''},
      formValid: false,
      seedFormValid: true,
      repeatPhase: false,
      mnemonic: generateMnemonic(128),
      mnemonicBack: ''
    }
  }

  handleUserInput(e) {
    const name = e.target.id;
    let value = '';
    if (name !== 'checkbox') {
      value = e.target.value;
    } else {
      value = e.target.checked;
    }
    this.setState({[name]: value},
        () => {
          this.validateField(name, value)
        });
  }

  validateField(name, value) {
    let fieldValidationErrors = this.state.formErrors;

    if (name === 'pass') {
      const strength = zxcvbn(value);
      // todo strength.score < 4 for production
      if (strength.score < 1) {
        fieldValidationErrors.pass = 'Passwords is too weak';
      } else {
        fieldValidationErrors.pass = ``;
      }
    } else if (name === 'checkbox') {
      if (!value) {
        fieldValidationErrors.checkbox = 'Please read and agree with terms of use';
      } else {
        fieldValidationErrors.checkbox = '';
      }
    } else if (name === 'AccName') {
      if (value.length < 3) {
        fieldValidationErrors.AccName = 'Account name is too short';
      } else {
        fieldValidationErrors.AccName = '';
      }
    }
    if (name === 'confPass' || name === 'pass') {
      if (this.state.pass !== this.state.confPass) {
        fieldValidationErrors.confPass = 'Passwords do not match';
      } else {
        fieldValidationErrors.confPass = '';
      }
    }

    this.setState({formErrors: fieldValidationErrors}, this.validateForm);
  }

  validateForm() {
    let valid = this.state.checkbox &&
        Object.values(this.state.formErrors).every((e, i, a) => e === '');
    this.setState({formValid: valid});
  }

  errorClass(name) {
    return this.state.formErrors[name] === '' ? "valid" : "wrong";
  }

  submitForm = () => {
    if (this.state.formValid) {
      this.setState({screen: 'seed'})
    }
  };

  passwordScreen() {
    return (
        <div className="container">
          <div className="screen screen-2">
            <div className="img-wrap">
              <img src={logo} alt="" className="logo"/>
            </div>


            <form action="#">
              <div className="field">
                <strong>Create an account name</strong>
                <input type="text" id="AccName" className={this.errorClass('AccName')}
                       value={this.state.AccName} onChange={this.handleUserInput.bind(this)}/>
                <p className="error">{this.state.formErrors['AccName']}</p>

              </div>
              <div className="field">
                <strong>Create a password</strong>
                <input type="password" id="pass" className={this.errorClass('pass')} value={this.state.pass}
                       onChange={this.handleUserInput.bind(this)}/>
                <p className="error">{this.state.formErrors['pass']}</p>

              </div>
              <div className="field">
                <strong>Confirm password</strong>
                <input type="password" id="confPass" className={this.errorClass('confPass')} value={this.state.confPass}
                       onChange={this.handleUserInput.bind(this)}/>
                <p className="error">{this.state.formErrors['confPass']}</p>

              </div>

              <div className="agree">
                <input type="checkbox" id="checkbox" onChange={this.handleUserInput.bind(this)}/>
                <label htmlFor="checkbox">
                  I have read and agree<br/> to the <a href="#">Terms of Use</a>
                </label>
              </div>

              <div className="buttons">
                <input type="submit" disabled={!this.state.formValid} value="Continue"
                       onClick={this.submitForm.bind(this)}
                       className="button green-button continue"/>
                <a href="#" className="back"><img src={back} alt=""/><img src={back_dark} alt=""/>Back</a>
              </div>
            </form>
          </div>
        </div>


    );
  }


  address() {
    return CoinbarnStorage.mnemonicToAddress(this.state.mnemonic)
  }

  handleSeedUserInput(e) {
    const name = e.target.id;
    if (name === 'phrase') {
      const value = e.target.value;
      this.setState({mnemonicBack: value}, this.validateSeedForm)
    }
  }

  validateSeedForm() {
    const valid = this.state.mnemonic === this.state.mnemonicBack;
    this.setState({seedFormValid: valid});
  }


  refreshMnemonic = () => {
    this.setState({mnemonic: generateMnemonic(128)})
  };

  copyToClipboard = () => {
    navigator.clipboard.writeText(this.state.mnemonic);
  };

  submit = async () => {
    if (this.state.repeatPhase === false) {
      this.setState({repeatPhase: true, seedFormValid: false});
    } else {
      const newState = new PublicAccount(this.state.AccName, this.address());
      this.props.setAccState(newState);
      await CoinbarnStorage.saveAccount(this.state.AccName, this.state.pass, this.state.mnemonic);
      console.log(CoinbarnStorage.getAccountNames());
      this.props.changeScreen('send');
    }
  };


  message() {
    if (this.state.repeatPhase) {
      return <p>
        Confirm the Secret Backup Phrase.<br/> Type it below in the correct order
      </p>
    } else {
      return <p>
        Be sure to save <span className="green-note">Secret Backup Phrase.</span><br/> You can copy or write it
        on a
        piece of paper. Keep it in a safe place.
      </p>

    }
  }

  textarea() {
    if (this.state.repeatPhase) {
      return <textarea name="phrase" id="phrase" className="text-phrase" value={this.state.mnemonicBack}
                       onChange={this.handleSeedUserInput.bind(this)}/>;
    } else {
      return <textarea name="phrase" id="phrase" className="text-phrase" readOnly={true} value={this.state.mnemonic}/>;
    }
  }

  seedScreen() {
    return (
        <div className="container">

          <div className="screen screen-5">
            <div className="img-wrap">
              <img src={logo} alt="" className="logo"/>
            </div>


            <form action="#">
              <h4 className="subtitle">
                Secret Backup Phrase
              </h4>

              {this.message()}

              <div className="buttons-area">
                <a href="#" className="refresh" onClick={this.refreshMnemonic}><img src={refresh} alt="refresh"/></a>
                <a href="#" className="copy" onClick={this.copyToClipboard}><img src={copy} alt="copy"/></a>
              </div>

              {this.textarea()}

              <strong>Your address:</strong>
              <button className="link">{this.address()}</button>

              <div className="buttons">
                <input value="Continue" readOnly={true} disabled={!this.state.seedFormValid}
                       className="button green-button continue"
                       onClick={this.submit}/>
                <a href="#" className="back"><img src={back} alt="back"/>Back</a>
              </div>

            </form>

          </div>
        </div>

    );

  }

  render() {
    let screen;
    if (this.state.screen === 'password') {
      screen = this.passwordScreen();
    } else {
      screen = this.seedScreen();
    }

    return (
        <div className="container">
          {screen}
        </div>
    );
  }
}

