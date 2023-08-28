export const processUserDataAndNavigate = (data, setUser, navigate) => {
  if (data && data.user) {
    const userId = data.user.id
    console.log(userId)
    setUser(data.user)
    console.log(data)
    navigate("/principal");
  } else {
    console.log("NOO.")
  }
};
