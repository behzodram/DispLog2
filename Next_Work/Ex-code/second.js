// Loading Existing file

function OnStart_second()
{
    var props = [
        {
            'Name of Students': 'name',
            'Age': 'age',
            'Mobile Number': 'number'
        }
    ]
    xls = app.CreateExcel( "myFile.xlsx", props )
    xls.SetOnLoad( OnLoad )
    xls.Load()
}
function OnLoad()
{
    sheet1 = xls.GetSheet( "Sheet1" )
    rows = sheet1.GetRows()
    app.Alert( JSON.stringify( rows ) )
}
