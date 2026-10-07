import json
import base64
import os

# Paths
json_path = "d:/IEEE/scripts/cicon_sessions_data.json"
public_dir = "d:/IEEE/public"
output_path = "d:/IEEE/CICON_2026_Session_Chairs_ID_Passes.html"

# Read data
with open(json_path, 'r', encoding='utf-8') as f:
    sessions = json.load(f)

# Helper to base64 encode images
def get_base64_image(filename):
    filepath = os.path.join(public_dir, filename)
    if not os.path.exists(filepath):
        return ""
    with open(filepath, "rb") as img_file:
        encoded = base64.b64encode(img_file.read()).decode('utf-8')
    ext = filename.split('.')[-1]
    return f"data:image/{ext};base64,{encoded}"

logo_uid = get_base64_image("logo-uid.png")
logo_ieee = get_base64_image("logo-ieee-gujarat.png")

# HTML Template Start
html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CICON 2026 - Session Chair ID Passes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @media print {
            @page { size: A4; margin: 10mm; }
            body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .no-print { display: none !important; }
            .break-inside-avoid { break-inside: avoid; }
        }
        body { background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    </style>
</head>
<body class="p-8">

    <div class="max-w-[1200px] mx-auto no-print mb-8 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Session Chair ID Passes</h1>
            <p class="text-gray-500 mt-1">Ready to print A4 format. Contains credentials and session details.</p>
        </div>
        <button onclick="window.print()" class="bg-[#002855] hover:bg-[#001f44] text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2">
            <i class="fas fa-print"></i> Print All Passes
        </button>
    </div>

    <div class="max-w-[1200px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 print:block print:w-full">
"""

# Generate Passes
for session in sessions:
    online_badge = '<span class="text-green-600 block text-xs mt-1"><i class="fas fa-globe text-green-500"></i> Online (GMeet)</span>' if session.get('mode') == 'Online' else ''
    
    pass_html = f"""
        <div class="break-inside-avoid print:mb-8 print:w-full bg-white rounded-2xl overflow-hidden border-2 border-[#002855] shadow-xl relative flex flex-col h-full">
            
            <!-- Lanyard Hole -->
            <div class="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 border-2 border-dashed border-white/50 rounded-full z-20"></div>
            
            <!-- Header -->
            <div class="bg-gradient-to-r from-[#002855] to-[#00629B] p-5 text-white relative">
                <div class="flex justify-between items-center mb-4">
                    <div class="w-[60px] h-[60px] bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
                        <img src="{logo_uid}" alt="UID" class="max-w-full max-h-full object-contain" />
                    </div>
                    <div class="text-center flex-1 px-4">
                        <h2 class="text-xl font-black tracking-wider uppercase mb-1">CICON 2026</h2>
                        <p class="text-[10px] font-medium opacity-90 uppercase tracking-widest">IEEE International Conference</p>
                    </div>
                    <div class="w-[100px] h-[40px] bg-white/10 rounded flex items-center justify-center p-1 shrink-0 backdrop-blur-sm border border-white/20">
                        <img src="{logo_ieee}" alt="IEEE" class="max-w-full max-h-full object-contain filter brightness-0 invert" />
                    </div>
                </div>
                <div class="text-center bg-white text-[#002855] font-black text-lg py-1.5 uppercase tracking-[0.2em] rounded border-b-4 border-yellow-400">
                    Session Chair
                </div>
            </div>

            <!-- Body -->
            <div class="p-6 flex flex-col sm:flex-row gap-6 flex-1">
                <!-- Left: Photo/QR -->
                <div class="flex flex-col items-center shrink-0 w-[140px]">
                    <div class="w-32 h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center mb-3 text-slate-400 text-xs text-center p-2 font-medium">
                        <i class="fas fa-user-circle text-4xl mb-2 text-slate-300 block"></i>
                        Attach Photo
                    </div>
                    <div class="w-full text-center">
                        <div class="text-[10px] font-bold text-slate-500 uppercase">Pass ID</div>
                        <div class="font-mono text-sm font-bold text-[#002855]">{session['sessionId']}</div>
                    </div>
                    <div class="mt-4 w-24 h-24 p-1 bg-white border border-slate-200 rounded relative overflow-hidden">
                        <div class="absolute inset-0 bg-[repeating-linear-gradient(45deg,#000_0,#000_10%,#fff_0,#fff_50%)] bg-[length:10px_10px] opacity-[0.15]"></div>
                        <div class="absolute inset-2 border-2 border-black/80 flex items-center justify-center">
                            <i class="fas fa-qrcode text-3xl text-black/80"></i>
                        </div>
                    </div>
                </div>

                <!-- Right: Info -->
                <div class="flex-1 flex flex-col text-sm">
                    <div class="mb-5">
                        <h3 class="text-2xl font-extrabold text-slate-900 leading-tight">{session['name']}</h3>
                        <p class="text-slate-600 font-medium text-xs mt-1 leading-relaxed max-w-[90%]">{session.get('institution', 'N/A')}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-x-4 gap-y-4 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                        <div class="col-span-2">
                            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wide">Session / Track</span>
                            <span class="font-bold text-[#00629B] text-base">{session['sessionName']}</span>
                        </div>
                        
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wide">Date & Time</span>
                            <span class="font-semibold text-slate-800">{session['date']}<br/>{session['time']}</span>
                        </div>
                        
                        <div>
                            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wide">Venue / Mode</span>
                            <span class="font-semibold text-slate-800">{session['venue']}{online_badge}</span>
                        </div>
                    </div>

                    <!-- Credentials -->
                    <div class="mt-auto bg-blue-50 border border-blue-200 rounded-xl p-4 relative overflow-hidden shadow-inner">
                        <div class="absolute right-[-15px] top-[-10px] text-blue-100/60 pointer-events-none">
                            <i class="fas fa-laptop-code text-[100px]"></i>
                        </div>
                        <div class="relative z-10">
                            <span class="text-[10px] uppercase font-bold text-blue-800 block mb-2 tracking-wide"><i class="fas fa-lock mr-1"></i> Portal Login Credentials</span>
                            <div class="flex flex-col gap-1.5 text-sm font-mono">
                                <div class="flex"><span class="text-blue-600/70 select-none w-12">URL:</span><span class="font-semibold text-slate-800 tracking-tight">cicon.karnavatiuniversity.edu.in</span></div>
                                <div class="flex"><span class="text-blue-600/70 select-none w-12">User:</span><span class="font-bold text-[#002855]">{session['username']}</span></div>
                                <div class="flex"><span class="text-blue-600/70 select-none w-12">Pass:</span><span class="font-bold text-red-600">{session['password']}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="bg-slate-100 p-2.5 text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] border-t border-slate-200 mt-auto">
                Valid only for {session['date']} • Non-Transferable
            </div>
        </div>
    """
    html += pass_html

html += """
    </div>
</body>
</html>
"""

with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"✅ Generated ID Passes at: {output_path}")
