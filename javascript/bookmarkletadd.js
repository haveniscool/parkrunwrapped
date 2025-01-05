window.addEventListener("load", (event) => {
    document.getElementById("gobutton").onclick = function () {
        const parkrunid = document.getElementById("parkrunid").value
    if (parkrunid.length == 0) {
        const errormessage = document.getElementById("errormessage")
        errormessage.classList += "show";
    } else {
    window.open(`https://www.parkrun.org.uk/parkrunner/${parkrunid}/5k`)
}   
    }

    const bookmarklet = "javascript:(function()%7Bconst%20bookmarkletVersion%20%3D%20%221.0%22%3Bfetch(%22https%3A%2F%2Fparkrunwrapped.havenline.art%2Fversion.json%22)%20.then((res)%20%3D%3E%20(res.ok%20%3F%20res.json()%20%3A%20Promise.reject(%22Fetch%20failed%22)))%20.then(%20(data)%20%3D%3E%20%7B%20if%20(bookmarkletVersion%20!%3D%3D%20data.currentversion)%20%7B%20const%20update%20%3D%20confirm(%20%22Bookmarklet%20is%20out%20of%20date.%20Do%20you%20want%20to%20update%20it%20to%20the%20most%20current%20version%3F%22%20)%3B%20if%20(update)%20%7B%20open(%22https%3A%2F%2Fparkrunwrapped.havenline.art%2F%22%2C%20%22_blank%22)%3B%20%7D%20%7D%20%7D%20)%20.catch((error)%20%3D%3E%20%7B%20console.error(%22Error%20fetching%20version%3A%22%2C%20error)%3B%20alert(%22Failed%20to%20check%20for%20bookmarklet%20update.%20Please%20try%20again%20later.%22)%3B%20%7D)%3B%20let%20script%20%3D%20document.createElement(%22script%22)%3B%20script.src%20%3D%20%22https%3A%2F%2Fparkrunwrapped.havenline.art%2Fjavascript%2Fbookmarklet.js%22%3B%20script.onerror%20%3D%20()%20%3D%3E%20%7B%20const%20report%20%3D%20window.confirm(%22Error%20001%3A%20Script%20failed.%20Report%3F%22)%3B%20if%20(report)%20%7B%20window.open(%22https%3A%2F%2Fform.jotform.com%2Fparkrunwrapped%2Ferrorreport%22)%3B%20%7D%20%7D%3B%20document.body.appendChild(script)%3B%7D)()%3B"
    document.getElementById("bookmarklet")[0].href = bookmarklet
        document.querySelector(".addtothis").href = bookmarklet

    })
    
