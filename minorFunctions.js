document.getElementById("bunkerGroupHighlight").addEventListener("click",()=>{
    highlightSelectedBunkerGroup()
})

function highlightSelectedBunkerGroup(){
    if(selectedGroup>bunkerGroupes.length) return
    if(bunkerGroupes.length == 0 )return
    bunkerGroupes[selectedGroup].highlightBunkerGroup()
    // console.log("highlight group ",selectedGroup)
    BGHighlightBool = true
    setTimeout(() => {
        BGHighlightBool = false
    }, 500);
}