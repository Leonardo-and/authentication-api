function validateInfos(email, password) {
  let status = 200;
  let error = false;
  let data = {};
  if (!email || !password) {
    status = 400;
    error = true;
    data = {
      error: "Invalid e-mail or password",
    };
  } else {
    const regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email)) {
      status = 400;
      error = true;
      data = {
        error: "Invalid e-mail",
      };
    }

    if (password.length < 8) {
      status = 400;
      error = true;
      data = {
        error: "Insecure password: less than 8 characters",
      };
    }
  }

  return { data, status, error };
}

module.exports = validateInfos;
