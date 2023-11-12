const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const AccountDetails = (props) => {
    return (
        <div className='account'>
            <h3 className='accountUser'>Username: {props.user}</h3>
            <h3 className='accountType'>Account type: {props.paid ? "Premium" : "Free" }</h3>
        </div>
    )
}

const loadAccountDetails = async () => {
    const response = await fetch('/getAccountUsernameType');
    const data = await response.json();
    ReactDOM.render(
        <AccountDetails paid={data.account[0].paidAccount} user={data.account[0].username}/>,
        document.getElementById("details")
    );
}

const init = () => {
    loadAccountDetails();
}

window.onload = init;