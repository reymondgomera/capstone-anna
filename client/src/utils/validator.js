const isEmailValid = userEmail => {
   return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail.toLowerCase());
};

export { isEmailValid };
