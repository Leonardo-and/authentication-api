function validateInfos(email, password) {
  if (!email || !password) {
    return {
      status: 400,
      error: true,
      data: {
        error: "Please enter e-mail and password",
      },
    };
  } else {
    const regexEmail = /\S+@\S+\.\S+/;
    if (!regexEmail.test(email)) {
      return {
        status: 400,
        error: true,
        data: {
          error: "Invalid e-mail",
        },
      };
    }

    if (password.length < 8) {
      return {
        status: 400,
        error: true,
        data: {
          error: "Password should be at least 8 characters long",
        },
      };
    }

    return {
      status: 200,
      error: false,
      data: {},
    };
  }
}

module.exports = validateInfos;
