import connect from 'sheet-db';
// var sheet = connect("1eF7JWtVib1nJgsjf4YPdrpPpPTO3Lkz2oEDqOIHxX0Q")
// console.log(sheet)
var sheet = connect('1eF7JWtVib1nJgsjf4YPdrpPpPTO3Lkz2oEDqOIHxX0Q', 
{token: 'AIzaSyDaI2q6LhDh8hPfpgQ3Mk_G0h2SgK7MMRM', version: 'v3'});
console.log(sheet)
sheet.createWorksheet('ABC').then(()=>{});




var sheet = connect('xx', {token: 'xx', version: 'v3'}); 
console.log(sheet) ////succeeded
sheet.createWorksheet('ABC').then(()=>{}); //forever waiting


// await sheet.worksheet('JUZI-TEST').then(function(worksheet) {
//     console.log("2")
//     return Promise.all([
//         // query everything
//         worksheet.find(),

//         // pass selector object
//        // worksheet.find({<mongo like selector>}),

//         // pass selector and also options
//         // Options:
//         // - skip: number of entries skipped from the beginning of the result
//         // - limit: limited length of the result
//         // - sort: single property name, used to sort the data set
//         // - descending: data set is sorted descending
//         // worksheet.find(
//         //     {<mongo like selector>},
//         //     {skip:<num>, limit:<num>, sort:'<fieldName>', descending:<bool>}
//         // )
        
//     ]);
// });
// await sheet.worksheet('JUZI-TEST').then(function(worksheet) {
//     console.log("2")
//     return Promise.all([
//         // query everything
//         worksheet.find()
//     ]);
// });


// update existing entry in the worksheet
// sheet.worksheet('JUZI-TEST').then(function(worksheet) {
//     return Promise.all([
//         // simple update
//         worksheet.update({<mongo like selector>}, {<new object or mongo updater>}),

//         // pass options...
//         // - multiple: update multiple entities (by default it updates only one, the first match)
//         // - upsert: if entity is not found it creates new if the update parameter is NOT a mongo updater
//         worksheet.update(
//             {<mongo like selector>},
//             {<new object or mongo updater>},
//             {multiple:<boolean>, upsert:<boolean>}
//         )
//     ]);
// });