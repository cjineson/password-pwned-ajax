const hostname = 'api.pwnedpasswords.com'
const debug = false;
var hash, suffix;

function pwnedResp() {
    var text = this.responseText;
    if (debug) console.log(`Pwned SHA Suffixes: \n${text}`)
    if (debug) console.log(`Looking for SHA1 Suffix: ${suffix}`);
    var matchindex = text.indexOf(suffix)
    if (matchindex >= 0) {
        var rx = /.*:(.*)$/m;
        var rxmatch = rx.exec(text.substring(matchindex));
        var count = rxmatch[1];
        if (debug) console.log(`Password pwned ${count} times`)
        document.getElementById('label').innerHTML = `Password pwned ${count} times`
    } else {
        if (debug) console.log(`Password OK`);
        document.getElementById('label').innerHTML = `Password OK`
    }
}

function checkPwned() {
    var pwd = document.querySelector('input').value;
    if (pwd) {
        hash = hex_sha1(pwd);
        var prefix = hash.substring(0, 5);
        suffix = hash.substring(5, 40).toUpperCase();
        if (debug) console.log(`Generated SHA1: ${hash}`);
        var url = `https://${hostname}/range/${prefix}`
        if (debug) console.log(`GET ${url}`);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", pwnedResp);
        xhr.open("GET", url);
        xhr.overrideMimeType("text/plain; charset=utf-8");
        xhr.send();
    }
}

var submitBtn = document.querySelector('button');
submitBtn.addEventListener('click', checkPwned);
