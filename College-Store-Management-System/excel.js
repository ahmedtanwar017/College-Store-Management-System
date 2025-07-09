// // import XlsxPopulate from 'xlsx-populate';

// // export async function dataToExcel(data, columns, res) {
// //     const workbook = await XlsxPopulate.fromBlankAsync();
// //     const sheet = workbook.sheet('Sheet1');

// //     // Populate data
// //     data.forEach((rowData, rowIndex) => {
// //         columns.forEach((columnName, colIndex) => {
// //             const cell = sheet.cell(rowIndex + 1, colIndex + 1);
// //             cell.value(rowData[columnName]);
// //             cell.style({ horizontalAlignment: 'center' }); // Center align the content
// //         });
// //     });

// //     // Increase column width based on content
// //     const MIN_COLUMN_WIDTH = 10;
// //     const MAX_COLUMN_WIDTH = 40;
// //     columns.forEach((columnName, colIndex) => {
// //         let columnWidth = Math.max(...data.map(rowData => String(rowData[columnName]).length)) * 1.5;
// //         columnWidth = Math.max(columnWidth, MIN_COLUMN_WIDTH);
// //         columnWidth = Math.min(columnWidth, MAX_COLUMN_WIDTH);
// //         sheet.column(colIndex + 1).width(columnWidth);
// //     });

// //     // Convert workbook to buffer
// //     const excelBuffer = await workbook.outputAsync();

// //     // Set response headers to make the file downloadable
// //     res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
// //     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

// //     // Send the Excel file as response
// //     res.send(excelBuffer);
// // }

// import XlsxPopulate from 'xlsx-populate';

// export async function dataToExcel(data, columns, res) {
//     const workbook = await XlsxPopulate.fromBlankAsync();
//     const sheet = workbook.sheet('Sheet1');

//     // Populate data
//     data.forEach((rowData, rowIndex) => {
//         columns.forEach((columnName, colIndex) => {
//             const cell = sheet.cell(rowIndex + 1, colIndex + 1);
//             cell.value(rowData[columnName]);
//             cell.style({ horizontalAlignment: 'center',  wrapText: true, 
//             verticalAlignment: 'top'}); // Center align the content

//             // Adjust row height based on content
//             const rowCount = Math.ceil(String(rowData[columnName]).length / 30); // Adjust the division factor as needed
//             if (rowCount > 1) {
//                 sheet.row(rowIndex + 1).height(20 * rowCount); // Adjust the height multiplier as needed
//             }
//         });
//     });

//     // Increase column width based on content
//     const MIN_COLUMN_WIDTH = 10;
//     const MAX_COLUMN_WIDTH = 40;
//     columns.forEach((columnName, colIndex) => {
//         let columnWidth = Math.max(...data.map(rowData => String(rowData[columnName]).length)) * 1.5;
//         columnWidth = Math.max(columnWidth, MIN_COLUMN_WIDTH);
//         columnWidth = Math.min(columnWidth, MAX_COLUMN_WIDTH);
//         sheet.column(colIndex + 1).width(columnWidth);
//     });

//     // Convert workbook to buffer
//     const excelBuffer = await workbook.outputAsync();

//     // Set response headers to make the file downloadable
//     res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

//     // Send the Excel file as response
//     res.send(excelBuffer);
// }


import XlsxPopulate from 'xlsx-populate';

export async function dataToExcel(data, columns, res) {
    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet('Sheet1');

    // Populate column headers
    columns.forEach((columnName, colIndex) => {
        const cell = sheet.cell(1, colIndex + 1); // First row for column headers
        cell.value(columnName);
        cell.style({ bold: true, horizontalAlignment: 'center', verticalAlignment: 'middle' });
    });

    // Convert datetime values to date and time format without timezone
    data.forEach(rowData => {
        Object.keys(rowData).forEach(columnName => {
            const cellValue = rowData[columnName];
            if (cellValue instanceof Date) {
                rowData[columnName] = cellValue.toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'medium' });
            }
        });
    });

    // Populate data
    data.forEach((rowData, rowIndex) => {
        columns.forEach((columnName, colIndex) => {
            const cell = sheet.cell(rowIndex + 2, colIndex + 1); // Offset by 1 row for column headers
            cell.value(rowData[columnName]);
            cell.style({ horizontalAlignment: 'center', wrapText: true, verticalAlignment: 'top' });

            // Adjust row height based on content
            const rowCount = Math.ceil(String(rowData[columnName]).length / 30); // Adjust the division factor as needed
            if (rowCount > 1) {
                sheet.row(rowIndex + 2).height(20 * rowCount); // Adjust the height multiplier as needed
            }
        });
    });

    // Increase column width based on content
    const MIN_COLUMN_WIDTH = 10;
    const MAX_COLUMN_WIDTH = 40;
    columns.forEach((columnName, colIndex) => {
        let columnWidth = Math.max(...data.map(rowData => String(rowData[columnName]).length)) * 1.5;
        columnWidth = Math.max(columnWidth, MIN_COLUMN_WIDTH);
        columnWidth = Math.min(columnWidth, MAX_COLUMN_WIDTH);
        sheet.column(colIndex + 1).width(columnWidth);
    });

    // Convert workbook to buffer
    const excelBuffer = await workbook.outputAsync();

    // Set response headers to make the file downloadable
    res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the Excel file as response
    res.send(excelBuffer);
}


