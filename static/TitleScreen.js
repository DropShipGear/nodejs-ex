var btn = document.createElement("BUTTON");        // Create a <button> element
var t = document.createTextNode("CLICK ME");       // Create a text node
btn.appendChild(t);                                // Append the text to <button>
btn.onclick = function ()
{
	var elem = document.getElementById(btn.getAttribute('id'));
	elem.parentNode.removeChild(elem);
}
document.body.appendChild(btn);  