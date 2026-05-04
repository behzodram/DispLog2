///////////////////// MAIN SERVICE CODE ////////////////////
var svc = null;
                          ///////////////////////////////                                           
                         // ==== SERVICE START =====  //                                            
                        /////////////////////////////// 

// 🚀 START SERVICE
function StartService() {
    if (!svc)    {
        svc = app.CreateService("this", "this", OnServiceReady);
        svc.SetOnMessage(MyServiceMSG);
        // txt.SetText("Service Status: RUNNING");
        // app.ShowPopup("Service Started");

        // Telefon restart bo'lsa ham ishlasin
        app.SetAutoBoot("Service");     
    }    else    {
        app.ShowPopup("Service already running");
    }
    // 🔔 SERVICE READY CALLBACK
    function OnServiceReady() {
        app.Debug("Service Ready");
    }
}

// 🛑 STOP SERVICE
function StopService() {
    if (svc)    {
        svc.Stop();
        svc = null;
        // txt.SetText("Service Status: OFF");
        // app.ShowPopup("Service Stopped");
    }
}

function MyServiceMSG(number) {
    app.ShowPopup( number );
    AppendNumber( number );
}

/////////// END OF SERVICE CODE //////////////////////

///// EDITED BY AI ///////////////////////////////////
function showTermuxInstruction(instructionId) {
    // Hide all instruction divs within termuxInstructionPanel
    const termuxPanel = document.getElementById('termuxInstructionPanel');
    if (termuxPanel) {
        const instructionDivs = termuxPanel.querySelectorAll('[id^="instruction-"]');
        instructionDivs.forEach(el => {
            el.style.display = 'none';
        });
        
        // Show the selected instruction
        const selectedInstruction = document.getElementById(instructionId);
        if (selectedInstruction) {
            selectedInstruction.style.display = 'block';
            termuxPanel.style.display = 'block';
        }
    }
    
    // Hide all notifications first
    const scriptNotif = document.getElementById('scriptNotification');
    const cmdNotif = document.getElementById('cmdNotification');
    const copyNotif = document.getElementById('copyNotification');
    
    if (scriptNotif) scriptNotif.style.display = 'none';
    if (cmdNotif) cmdNotif.style.display = 'none';
    if (copyNotif) copyNotif.style.display = 'none';
    
    // Show appropriate notification based on instruction
    if (instructionId === 'instruction-1' && scriptNotif) {
        scriptNotif.style.display = 'flex';
        setTimeout(() => {
            scriptNotif.style.display = 'none';
        }, 3000);
    } else if (instructionId === 'instruction-2' && cmdNotif) {
        cmdNotif.style.display = 'flex';
        setTimeout(() => {
            cmdNotif.style.display = 'none';
        }, 3000);
    } else if (instructionId === 'instruction-3' && copyNotif) {
        copyNotif.style.display = 'flex';
        setTimeout(() => {
            copyNotif.style.display = 'none';
        }, 3000);
    }
}

function toggleGeneralInstruction() {
    const container = document.getElementById('generalInfoContainer');
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

function toggleServiceInfo() {
    const container = document.getElementById('serviceInfoContainer');
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

// Hide instruction panel when clicking outside termux section
document.addEventListener('click', function(event) {
    const termuxPanel = document.getElementById('termuxInstructionPanel');
    const termuxSection = document.querySelector('.termux-buttons-section');
    
    if (termuxPanel && termuxSection && !termuxSection.contains(event.target) && !termuxPanel.contains(event.target)) {
        if (!event.target.closest('.general-info-toggle')) {
            termuxPanel.style.display = 'none';
        }
    }
});