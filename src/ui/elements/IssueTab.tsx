import {Client} from "@coinbarn/ergo-ts";
import React from 'react';
import Account from "../../Account";
import InputBlock from "./InputBlock";

interface IIssueTabProps {
  account: Account

  setCurrTab(n: number, refresh?: boolean): void
}

interface IIssueTabState {
  description: string
  formValid: boolean
}


export default class IssueTab extends React.Component<IIssueTabProps, IIssueTabState> {
  public nameElement: any;
  public decimalsElement: any;
  public amountElement: any;

  constructor(props) {
    super(props);
    this.state = {
      description: ' ',
      formValid: false,
    };

    this.nameElement = React.createRef();
    this.decimalsElement = React.createRef();
    this.amountElement = React.createRef();
  }

  public validateName = (name) => {
    if (name.length > 10) {
      return 'Name is too long';
    } else {
      return '';
    }
  };

  public validateAmount = (amount) => {
    if (amount > 1000000000 || amount <= 0) {
      return 'Amount should be from 0 to 1000000000';
    } else {
      return '';
    }
  };

  public validateDecimals = (decimals) => {
    if (decimals > 9) {
      return 'Number of decimal places should be from 0 to 9';
    } else {
      return '';
    }
  };

  public onUpdate = () => {
    const amountIsValid = this.amountElement.current.state.isValid;
    const decimalsIsValid = this.decimalsElement.current.state.isValid;
    const nameIsValid = this.nameElement.current.state.isValid;
    const formValid = amountIsValid && decimalsIsValid && nameIsValid;

    if (this.state.formValid !== formValid) {
      this.setState({formValid: formValid})
    }
  };

  public handleUserInput(e) {
    const value = e.target.value;
    this.setState({description: value}, this.onUpdate);
  }

  public onSend = async () => {
    const amount = this.amountElement.current.state.value;
    const decimals = this.decimalsElement.current.state.value;
    const name = this.nameElement.current.state.value;
    const description = this.state.description;
    const sk = this.props.account.sk;

    const client = new Client();
    const result = await client.tokenIssue(sk, name, amount, decimals, description);
    if (result.data.id) {
      console.log(`Transaction with id ${result.data.id} sent`);
    } else {
      console.log(`Transaction send error: ${JSON.stringify(result)}`);
    }
    this.props.setCurrTab(1, true)
  };

  public render() {
    return (
      <div className='issueTab'>
        <h3> Create your token on ERGO Platform </h3>
        <InputBlock ref={this.nameElement}
                    large={true}
                    name='Asset name'
                    validate={this.validateName}
                    onUpdate={this.onUpdate}/>
        <InputBlock ref={this.amountElement}
                    large={true}
                    name='Net amount'
                    type='number'
                    validate={this.validateAmount}
                    onUpdate={this.onUpdate}/>
        {/*TODO do not allow to input decimals*/}
        <InputBlock ref={this.decimalsElement}
                    large={true}
                    type='number'
                    name='Decimal places'
                    validate={this.validateDecimals}
                    onUpdate={this.onUpdate}/>
        <div className='inputLabel ffn'>Brief description</div>
        <textarea value={this.state.description} onChange={this.handleUserInput.bind(this)}/>
        <button className='mediumBtn' disabled={!this.state.formValid} onClick={this.onSend}>Issue</button>
      </div>
    );
  }
}
