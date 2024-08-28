import React, { useState, Fragment } from "react";
import { Prompt } from "react-router-dom";
import { useSelector } from "react-redux";
import classes from "./contactForm.module.css";
import Button from "../UI/Button";
import useInput from "../../hooks/useInput";

const ContactForm = () => {
  const [isEntering, setIsEntering] = useState(false);
  const [result, setResult] = useState("");
  const [btnText, setBtnText] = useState('Send Message');
  const [isSent, setIsSent] = useState(false);
  const [enteredLName, setEnteredLName] = useState('');

  const {
    value: enteredName,
    hasError: nameInputHasError,
    isValid: enteredNameIsValid,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput((value) => value.trim() !== '');

  const {
    value: enteredPhone,
    hasError: phoneInputHasError,
    isValid: enteredPhoneIsValid,
    valueChangeHandler: phoneChangedHandler,
    inputBlurHandler: phoneBlurHandler,
  } = useInput((value) => value.trim().length >= 10);

  const {
    value: enteredEmail,
    hasError: emailInputHasError,
    isValid: enteredEmailIsValid,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => value.includes('@'));

  const {
    value: enteredMessage,
    hasError: messageInputHasError,
    isValid: enteredMessageIsValid,
    valueChangeHandler: messageChangedHandler,
    inputBlurHandler: messageBlurHandler,
  } = useInput((value) => value.trim().length >= 10);

  const formIsValid =
    enteredNameIsValid &&
    enteredEmailIsValid &&
    enteredMessageIsValid &&
    enteredPhoneIsValid;

  const lastNameChangeHandler = (event) => {
    setEnteredLName(event.target.value);
  };

  const finishEnteringHandler = () => {
    setIsEntering(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");

    if (!formIsValid) {
      return;
    }

    const formData = new FormData(event.target);
    formData.append("access_key", "9be399a1-d1da-485c-a833-1af69a0d69f7");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        setIsSent(true);
        setBtnText('Message Sent');
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setResult("Failed to send the message. Please try again.");
    }
  };

  const formFocussedHandler = () => {
    setIsEntering(true);
  };

  const nameInputClasses = nameInputHasError
    ? `${classes.Inputs} ${classes.invalidInput}`
    : classes.Inputs;
  const emailInputClasses = emailInputHasError
    ? `${classes.Inputs} ${classes.invalidInput}`
    : classes.Inputs;
  const phoneInputClasses = phoneInputHasError
    ? `${classes.Inputs} ${classes.invalidInput}`
    : classes.Inputs;
  const messageInputClasses = messageInputHasError
    ? `${classes.Inputs} ${classes.invalidInput}`
    : classes.Inputs;

  const formClasses = isSent
    ? `${classes.contactForm} ${classes.sent}`
    : classes.contactForm;

  const nonThemeColor = useSelector((state) => state.nonThemeColor);

  return (
    <Fragment>
      <Prompt
        when={isEntering}
        message={(location) =>
          'Are you sure you want to leave? All your entered data will be lost!'
        }
      />
      <div className={classes.contactFormCard}>
        <h1 style={{ color: nonThemeColor }}>Leave A Message</h1>
        <form
          onFocus={formFocussedHandler}
          onSubmit={onSubmit}
          className={formClasses}
        >
          <input
            type="text"
            name="name"
            value={enteredName}
            onBlur={nameBlurHandler}
            onChange={nameChangedHandler}
            className={nameInputClasses}
            placeholder="First Name"
            disabled={isSent}
            aria-label="First Name"
            required
          />
          <input
            type="text"
            id="lName"
            name="lastName"
            value={enteredLName}
            onChange={lastNameChangeHandler}
            className={classes.Inputs}
            placeholder="Last Name (optional)"
            disabled={isSent}
            aria-label="Last Name"
          />
          <input
            type="email"
            name="email"
            value={enteredEmail}
            onBlur={emailBlurHandler}
            onChange={emailChangedHandler}
            className={emailInputClasses}
            placeholder="Email"
            disabled={isSent}
            aria-label="Email"
            required
          />
          <input
            type="text"
            name="phone"
            value={enteredPhone}
            onBlur={phoneBlurHandler}
            onChange={phoneChangedHandler}
            className={phoneInputClasses}
            placeholder="Phone"
            minLength={10}
            maxLength={12}
            disabled={isSent}
            aria-label="Phone"
            required
          />
          <textarea
            name="message"
            value={enteredMessage}
            onBlur={messageBlurHandler}
            onChange={messageChangedHandler}
            className={messageInputClasses}
            placeholder="Message"
            disabled={isSent}
            aria-label="Message"
            required
          ></textarea>
          <div className={classes.sendBtn}>
            <Button type="submit" disabled={!formIsValid || isSent}>
              {btnText}
            </Button>
          </div>
        </form>
        <span>{result}</span>
      </div>
    </Fragment>
  );
};

export default ContactForm;
