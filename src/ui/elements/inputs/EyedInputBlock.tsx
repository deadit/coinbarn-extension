import React from 'react';
import InputMessages from './InputMessages';

interface IEyedInputBlockProps {
  name: string,
  onUpdate: () => void
  validate: (value: string) => { score: number, error: string }
}

interface IEyedInputBlockState {
  value: string
  validity: string
  isValid: boolean
  error: string
  type: string
}

export default class EyedInputBlock extends React.Component<IEyedInputBlockProps, IEyedInputBlockState> {

  public static defaultProps = {
    name: 'name',
    onUpdate: () => {
    },
    type: 'password',
  };

  constructor(props) {
    super(props);
    this.state = {
      error: 'error',
      validity: '',
      value: '',
      isValid: false,
      type: 'password'
    };
  }

  public toggleType() {
    this.setState({type: this.state.type === '' ? 'password' : ''});
  }

  public handleUserInput(e) {
    const value = e.target.value;
    const validity = this.props.validate(value);
    this.updateValidity(validity, value);
  }

  public render() {
    let className = 'validateInput';
    if (this.state.value !== '') {
      className = className.concat(' ').concat(this.state.validity);
    }

    return (
      <div className={className}>
        <div className='inputLabel ffn'>{this.props.name}</div>
        <input type={this.state.type} className='fts'
               onChange={this.handleUserInput.bind(this)} value={this.state.value}/>
        <button className='eyeButton' onClick={this.toggleType.bind(this)}></button>
        <InputMessages msg='' errorMsg={this.state.error} />
      </div>
    );
  }

  private updateValidity(validity, value) {
    const isValid = (validity.score >= 1);
    let validityClass: string;
    if (validity.score < 1) {
      validityClass = 'invalidInput';
    } else if (validity.score < 3) {
      validityClass = 'semivalidInput';
    } else {
      validityClass = 'validInput';
    }

    this.setState({
      value: value,
      error: validity.error,
      isValid: isValid,
      validity: validityClass
    }, this.props.onUpdate);
  }
}
