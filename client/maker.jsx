const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector("#domoName").value;
    const age = e.target.querySelector("#domoAge").value;

    if(!name || !age) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, age}, loadDomosFromServer);
    return false;
}

const DomoForm = (props) => {
    return (
        <form   id="domoForm"
                name="domoForm"
                onSubmit={handleDomo}
                action='/maker'
                method='POST'
                className='domoForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name' />
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min='0' name='age' />
            <input className='makeDomoSubmit' type='submit' value='Make Domo' />
        </form>
    );
};

const DomoList = (props) => {
    if(props.domos.length === 0) {
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No domos yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return (
            <div key={domo._id} className='domo'>
                <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
}

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
}

const loadAccountType = async () => {
    const response = await fetch('/getAccountUsernameType');
    const data = await response.json();
    ReactDOM.render(
        <AccountType paid={data.account[0].paidAccount}/>,
        document.getElementById("accountType")
    )
}

const handleUpgrade = (e) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost('./upgradeAccount');
    
    loadAccountType();
    return false;
}

const AccountType = (props) => {  
    return (
        <div className='account'>
            <h3 className='accountType'>Account type: {props.paid ? "Premium" : "Free" }</h3>
            {!props.paid ? 
            <form   id="upgradeForm"
                name="upgradeForm"
                onSubmit={handleUpgrade}
                action='/upgradeAccount'
                method='POST'
                className='upgradeForm'
        >
            <input className='upgradeAccount' type='submit' value='Upgrade to Premium Account' />
        </form> : null}
        </div>
    )
}

const init = () => {
    ReactDOM.render(<DomoForm />, document.getElementById('makeDomo'));
    ReactDOM.render(<DomoList domos={[]} />, document.getElementById('domos'));
    loadAccountType();
    loadDomosFromServer();
}

window.onload = init;