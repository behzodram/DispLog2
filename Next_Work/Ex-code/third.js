// Reading multiple sheets

function OnStart_third()
{
    // We assume 2 sheets with names "UserA" and "UserB"

    /*
    UserA
    Last Name | First Name | Age

    UserB
    Complete Name | Current Address | Favorite Color
    */

    var props = [
        {
            'Last Name': 'lastName',
            'First Name': 'firstName',
            'Age': 'age'
        },
        {
            'Complete Name': 'comName',
            'Current Address': 'currAddress',
            'Favorite Color': 'favColor'
        }
    ]
    xls = app.CreateExcel( "myFile.xlsx", props )
    xls.SetOnLoad( OnLoad )
    xls.Load()
}
function OnLoad()
{
    userA = xls.GetSheet( "UserA" )
    userB = xls.GetSheet( "UserB" )

    userA.AddRows([
        { lastName: "Stark", firstName: "Sansa", age: 18 },
        { lastName: "Stark", firstName: "Rob", age: 25 },
        { lastName: "Stark", firstName: "Brandon", age: 12 }
    ])

    userB.AddRows([
        {
            comName: "Arya Stark",
            currAddress: "Winterfell",
            favColor: "Black"
        }
    ])

    xls.Save()
}
