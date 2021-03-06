import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Alert from '../UI/Alert/Alert';
import formFields from './formFields';
import DoctorFormField from './DoctorFormField';
import * as actions from '../../actions';

class DoctorForm extends Component{
    state = {
        showError: false
    }

    renderField(){
        return _.map(formFields, ({label, name}) => {
            return <Field 
                key={name}
                component={DoctorFormField}
                type="text"
                label={label}
                name={name}
            />
        });
    }

    async submitHandler(formValues){
        if(this.props.auth.data.credits > 0){
            return await this.props.createDoctor(formValues, this.props.history);
        }
        this.setState({ 
            ...this.state,
            showError: true 
        });
    }

    render(){
        return (
            <div>
                {this.state.showError ? 
                    (
                        <Alert onAlertClosed={() => this.setState({ ...this.state, showError: false })}>
                            <h5>You should need atleast one credit to add Doctor!</h5>
                        </Alert>
                    ) :
                    null
                }
                <form 
                    onSubmit = {this.props.handleSubmit(async (formValues) => {return await this.submitHandler(formValues)})}
                >
                    {this.renderField()}
                    <Link to="/hospital/doctors" className="red btn-flat white-text">
                        Cancel
                    </Link>
                    <button type="submit" className="teal btn-flat right white-text" disabled={ this.props.submitting }>
                        Submit
                        <i className="material-icons right">done</i>
                    </button>
                </form>
            </div>
        );
    }
}

function validate(values){
    const errors = {};

    _.each(formFields, ({ name }) => {
        if(!values[name]){
            errors[name] = 'You must provide a value';
        }
    });

    return errors;
}


function mapStateToProps({ auth }){
    return { auth };
};

export default connect(mapStateToProps, actions)(reduxForm({
    validate,
    form: 'doctorForm'
})(DoctorForm));