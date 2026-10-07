import pandas as pd
import json

data = json.load(open('d:/IEEE/scripts/cicon_sessions_data.json', encoding='utf-8'))
df = pd.DataFrame([{
    'Chair Name': d['name'], 
    'Track / Session': d['sessionName'], 
    'Username': d['username'], 
    'Password': d['password'], 
    'Venue': d['venue'], 
    'Time': d['time']
} for d in data])

writer = pd.ExcelWriter('d:/IEEE/CICON_2026_Session_Chairs_Credentials.xlsx', engine='xlsxwriter')
df.to_excel(writer, index=False, sheet_name='Credentials')

workbook = writer.book
worksheet = writer.sheets['Credentials']

# Add header format
header_format = workbook.add_format({
    'bold': True,
    'bg_color': '#D3D3D3',
    'border': 1
})

# Set fixed column widths
worksheet.set_column('A:A', 25)
worksheet.set_column('B:B', 70)
worksheet.set_column('C:C', 20)
worksheet.set_column('D:D', 15)
worksheet.set_column('E:E', 25)
worksheet.set_column('F:F', 30)

# Apply header format
for col_num, value in enumerate(df.columns.values):
    worksheet.write(0, col_num, value, header_format)

writer.close()
print("Excel formatted perfectly!")
