function copyToClipboard(copyFrom) {
    /* Get the text field */
    let copyText, copyButton;

    if (copyFrom == "shortURL") {
        copyText = document.getElementById("shortURL");
        copyButton = document.getElementById("copy-button-url-shortener");
    }
    else {
        copyText = document.getElementById("passwordOutput");
        copyButton = document.getElementById("copy-button-pwGen");
    }

    let delayInMilliseconds = 1000; //1 second
    let startingText = copyButton.innerHTML;

    copyButton.innerText = "Copied!";
    copyButton.classList.remove("btn-primary");
    copyButton.classList.add("btn-success");
    
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
    
    /* Set to default the text of the button */
    setTimeout(function() {
      copyButton.innerHTML = startingText;
      copyButton.classList.add("btn-primary");
      copyButton.classList.remove("btn-success");
    }, delayInMilliseconds);

    // /* Alert the copied text */
    // alert("Copied the text: " + copyText.value);
}