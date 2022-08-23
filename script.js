async function request(){
    const result = await axios.get("https://hack-or-snooze-v3.herokuapp.com/stories")
    console.log(result)
}