// Create exel file and add sheets

function OnStart_first()
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
    var rows = [
        { name: "John Doe", age: 26, number: 123456789 },
        { name: "Jane Doe", age: 27, number: 123456789 },
        { name: "Jhonny Doe", age: 28, number: 123456789 }
    ]
    sheet1 = xls.AddSheet( "Sheet1" )
    sheet1.AddRows( rows )
    xls.Save()
}
