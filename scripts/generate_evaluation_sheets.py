import xlsxwriter
import os

def create_ieee_sheets():
    output_path = r"d:\IEEE\IEEE_Conference_Evaluation_and_Feedback_Sheets.xlsx"
    workbook = xlsxwriter.Workbook(output_path)
    
    # ------------------ STYLES ------------------
    navy = "#002855"     # IEEE Blue
    accent_blue = "#00629B"
    light_blue = "#E6F0FA"
    light_gray = "#F4F6F9"
    border_color = "#BDC3C7"
    header_gray = "#EAECEE"
    
    title_fmt = workbook.add_format({
        'bold': True, 'font_size': 16, 'font_color': navy,
        'align': 'center', 'valign': 'vcenter', 'font_name': 'Segoe UI'
    })
    subtitle_fmt = workbook.add_format({
        'bold': True, 'font_size': 12, 'font_color': accent_blue,
        'align': 'center', 'valign': 'vcenter', 'font_name': 'Segoe UI'
    })
    meta_label_fmt = workbook.add_format({
        'bold': True, 'font_size': 10, 'bg_color': light_blue,
        'font_color': '#1A365D', 'border': 1, 'border_color': border_color,
        'valign': 'vcenter', 'font_name': 'Segoe UI'
    })
    meta_val_fmt = workbook.add_format({
        'font_size': 10, 'border': 1, 'border_color': border_color,
        'valign': 'vcenter', 'font_name': 'Segoe UI'
    })
    th_fmt = workbook.add_format({
        'bold': True, 'font_size': 11, 'bg_color': navy,
        'font_color': 'white', 'align': 'center', 'valign': 'vcenter',
        'border': 1, 'border_color': border_color, 'text_wrap': True,
        'font_name': 'Segoe UI'
    })
    th_secondary_fmt = workbook.add_format({
        'bold': True, 'font_size': 10, 'bg_color': accent_blue,
        'font_color': 'white', 'align': 'center', 'valign': 'vcenter',
        'border': 1, 'border_color': border_color, 'text_wrap': True,
        'font_name': 'Segoe UI'
    })
    td_c_fmt = workbook.add_format({
        'align': 'center', 'valign': 'vcenter', 'font_size': 10,
        'border': 1, 'border_color': border_color, 'font_name': 'Segoe UI'
    })
    td_l_fmt = workbook.add_format({
        'align': 'left', 'valign': 'vcenter', 'font_size': 10,
        'border': 1, 'border_color': border_color, 'font_name': 'Segoe UI',
        'text_wrap': True
    })
    td_num_fmt = workbook.add_format({
        'align': 'center', 'valign': 'vcenter', 'font_size': 10,
        'border': 1, 'border_color': border_color, 'font_name': 'Segoe UI',
        'num_format': '#,##0'
    })
    td_total_fmt = workbook.add_format({
        'bold': True, 'align': 'center', 'valign': 'vcenter', 'font_size': 11,
        'bg_color': light_blue, 'font_color': navy, 'border': 2,
        'border_color': accent_blue, 'font_name': 'Segoe UI'
    })
    td_total_label_fmt = workbook.add_format({
        'bold': True, 'align': 'right', 'valign': 'vcenter', 'font_size': 11,
        'bg_color': light_blue, 'font_color': navy, 'border': 2,
        'border_color': accent_blue, 'font_name': 'Segoe UI'
    })
    section_h_fmt = workbook.add_format({
        'bold': True, 'font_size': 11, 'bg_color': header_gray,
        'font_color': '#2C3E50', 'border': 1, 'border_color': border_color,
        'valign': 'vcenter', 'font_name': 'Segoe UI'
    })
    rubric_h_fmt = workbook.add_format({
        'bold': True, 'font_size': 10, 'bg_color': '#2C3E50',
        'font_color': 'white', 'align': 'center', 'valign': 'vcenter',
        'border': 1, 'border_color': border_color, 'font_name': 'Segoe UI'
    })
    rubric_body_fmt = workbook.add_format({
        'font_size': 9, 'border': 1, 'border_color': border_color,
        'valign': 'top', 'font_name': 'Segoe UI', 'text_wrap': True
    })

    # =========================================================================
    # SHEET 1: Presentation Evaluation Form (Single Paper)
    # =========================================================================
    ws1 = workbook.add_worksheet("Paper Evaluation Form")
    ws1.set_margins(0.5, 0.5, 0.5, 0.5)
    ws1.set_paper(9) # A4
    ws1.fit_to_pages(1, 1)

    ws1.set_column('A:A', 5)
    ws1.set_column('B:B', 38)
    ws1.set_column('C:C', 16)
    ws1.set_column('D:D', 18)
    ws1.set_column('E:E', 25)

    ws1.merge_range('A2:E2', "IEEE INTERNATIONAL CONFERENCE", title_fmt)
    ws1.merge_range('A3:E3', "SESSION CHAIR — PAPER PRESENTATION EVALUATION FORM", subtitle_fmt)
    ws1.set_row(1, 24)
    ws1.set_row(2, 20)

    # Conference Metadata
    ws1.set_row(4, 20)
    ws1.write('A5', "Track:", meta_label_fmt)
    ws1.merge_range('B5:C5', "Track 1: Artificial Intelligence & Data Science", meta_val_fmt)
    ws1.write('D5', "Date & Time:", meta_label_fmt)
    ws1.write('E5', "2026-10-15 | 10:00 AM - 01:00 PM", meta_val_fmt)

    ws1.set_row(5, 20)
    ws1.write('A6', "Session:", meta_label_fmt)
    ws1.merge_range('B6:C6', "Technical Session 2A (Room: Auditorium Hall B)", meta_val_fmt)
    ws1.write('D6', "Venue / Hall:", meta_label_fmt)
    ws1.write('E6', "Hall B / Online Hybrid", meta_val_fmt)

    # Paper & Presenter Details
    ws1.set_row(6, 20)
    ws1.write('A7', "Paper ID:", meta_label_fmt)
    ws1.write('B7', "IEEE-2026-104", meta_val_fmt)
    ws1.write('C7', "Presenter Name:", meta_label_fmt)
    ws1.merge_range('D7:E7', "Dr. Rajesh Sharma", meta_val_fmt)

    ws1.set_row(7, 24)
    ws1.write('A8', "Paper Title:", meta_label_fmt)
    ws1.merge_range('B8:E8', "Edge-Assisted Federated Learning for Real-Time Threat Detection in IoT Networks", meta_val_fmt)

    # Session Chair Details
    ws1.set_row(8, 20)
    ws1.write('A9', "Chair Name:", meta_label_fmt)
    ws1.write('B9', "Dr. Ananya Verma", meta_val_fmt)
    ws1.write('C9', "Institution / Affiliation:", meta_label_fmt)
    ws1.merge_range('D9:E9', "National Institute of Technology", meta_val_fmt)

    # Evaluation Rubrics Table
    ws1.set_row(10, 26)
    ws1.write('A11', "No.", th_fmt)
    ws1.write('B11', "Evaluation Parameter", th_fmt)
    ws1.write('C11', "Maximum Marks", th_fmt)
    ws1.write('D11', "Marks Awarded", th_fmt)
    ws1.write('E11', "Chair Remarks / Comments", th_fmt)

    params = [
        ("1", "Relevance, Significance & Novelty", 10, 9, "High industrial relevance and unique federated architecture."),
        ("2", "Technical Quality & Methodology", 10, 8, "Rigorous mathematical formulation and edge pipeline."),
        ("3", "Results & Research Contribution", 10, 9, "Outperforms baseline models with 94.8% accuracy."),
        ("4", "Presentation Quality & Clarity", 10, 8, "Clear slides, effective flow, and excellent time management."),
        ("5", "Q&A / Subject Knowledge", 10, 9, "Handled complex architectural questions with deep subject knowledge.")
    ]

    for idx, (no, param, max_m, awarded, rem) in enumerate(params, start=12):
        ws1.set_row(idx - 1, 24)
        ws1.write(f'A{idx}', no, td_c_fmt)
        ws1.write(f'B{idx}', param, td_l_fmt)
        ws1.write(f'C{idx}', max_m, td_c_fmt)
        ws1.write(f'D{idx}', awarded, td_num_fmt)
        ws1.write(f'E{idx}', rem, td_l_fmt)

    # Total Row
    ws1.set_row(16, 26)
    ws1.merge_range('A17:B17', "Total Score", td_total_label_fmt)
    ws1.write('C17', 50, td_total_fmt)
    ws1.write_formula('D17', '=SUM(D12:D16)', td_total_fmt)
    ws1.write('E17', "(Evaluated out of 50 Marks)", td_c_fmt)

    # Recommendation for Best Paper
    ws1.set_row(18, 26)
    ws1.merge_range('A19:B19', "Recommendation for Best Paper Award?", meta_label_fmt)
    ws1.merge_range('C19:E19', " [ X ] YES       [   ] NO", td_total_fmt)

    ws1.set_row(20, 32)
    ws1.merge_range('A21:E21', "Session Chair Summary & Constructive Feedback to Authors:\n"
                               "The work demonstrates outstanding promise for publication and honors. Highly recommended for the Best Paper Award track.", td_l_fmt)

    # Signature Block
    ws1.set_row(22, 22)
    ws1.merge_range('A23:B23', "Session Chair Signature: ____________________________", td_l_fmt)
    ws1.merge_range('C23:E23', "Date: ________________________", td_l_fmt)

    # =========================================================================
    # SHEET 2: Session Consolidated Score Sheet (Multi-paper matrix)
    # =========================================================================
    ws2 = workbook.add_worksheet("Session Consolidated Sheet")
    ws2.set_margins(0.5, 0.5, 0.5, 0.5)
    ws2.set_landscape()

    ws2.set_column('A:A', 5)   # Sl
    ws2.set_column('B:B', 14)  # Paper ID
    ws2.set_column('C:C', 32)  # Paper Title
    ws2.set_column('D:D', 20)  # Presenter Name
    ws2.set_column('E:E', 13)  # Parameter 1
    ws2.set_column('F:F', 13)  # Parameter 2
    ws2.set_column('G:G', 13)  # Parameter 3
    ws2.set_column('H:H', 13)  # Parameter 4
    ws2.set_column('I:I', 13)  # Parameter 5
    ws2.set_column('J:J', 13)  # Total /50
    ws2.set_column('K:K', 15)  # Best Paper Nom?
    ws2.set_column('L:L', 20)  # Remarks

    ws2.merge_range('A2:L2', "IEEE INTERNATIONAL CONFERENCE — TECHNICAL SESSION CONSOLIDATED EVALUATION SHEET", title_fmt)
    ws2.merge_range('A3:L3', "Session Chair Master Evaluation Register (Total: 50 Marks per Paper)", subtitle_fmt)
    ws2.set_row(1, 24)
    ws2.set_row(2, 18)

    # Metadata row
    ws2.write('A5', "Track:", meta_label_fmt)
    ws2.merge_range('B5:D5', "Track 1: Intelligent Systems & Computing", meta_val_fmt)
    ws2.write('E5', "Session Name / Hall:", meta_label_fmt)
    ws2.merge_range('F5:H5', "Session 1A (Hall B - Audi 2)", meta_val_fmt)
    ws2.write('I5', "Chair Name:", meta_label_fmt)
    ws2.merge_range('J5:L5', "Dr. Ananya Verma", meta_val_fmt)

    # Table Header
    ws2.set_row(6, 36)
    ws2.write('A7', "Sl No.", th_fmt)
    ws2.write('B7', "Paper ID", th_fmt)
    ws2.write('C7', "Paper Title", th_fmt)
    ws2.write('D7', "Presenter Name", th_fmt)
    ws2.write('E7', "Relevance & Novelty\n(Max 10)", th_fmt)
    ws2.write('F7', "Technical & Method\n(Max 10)", th_fmt)
    ws2.write('G7', "Results & Contrib.\n(Max 10)", th_fmt)
    ws2.write('H7', "Presentation Clarity\n(Max 10)", th_fmt)
    ws2.write('I7', "Q&A Knowledge\n(Max 10)", th_fmt)
    ws2.write('J7', "Total Score\n(Max 50)", th_fmt)
    ws2.write('K7', "Best Paper\nNominated?", th_fmt)
    ws2.write('L7', "Remarks", th_fmt)

    sample_papers = [
        ("1", "IEEE-101", "Edge-Assisted Federated Learning in IoT Networks", "Dr. Rajesh Sharma", 9, 8, 9, 8, 9, "YES", "Strong candidate"),
        ("2", "IEEE-102", "Adaptive Vision Transformers for Medical Imaging", "Sneha Roy", 8, 8, 7, 9, 8, "NO", "Very good presentation"),
        ("3", "IEEE-103", "Zero-Shot Anomaly Detection in High-Speed Rail", "Vikram Patel", 7, 7, 8, 7, 7, "NO", "Good methodology"),
        ("4", "IEEE-104", "Self-Supervised Graph Learning for Fraud Defense", "Dr. Meera Iyer", 9, 9, 9, 8, 9, "YES", "Outstanding innovation"),
        ("5", "IEEE-105", "Energy-Efficient Scheduling in Cloud Data Centers", "Amitabh Das", 7, 6, 6, 7, 6, "NO", "Solid experimental work"),
        ("6", "IEEE-106", "Secure Smart Contracts with Formal Verification", "Pooja Hegde", 8, 8, 7, 8, 7, "NO", "Clear exposition"),
        ("7", "IEEE-107", "Quantum Key Distribution Protocols for 6G", "Naveen Chander", 8, 7, 8, 7, 7, "NO", "Promising research"),
        ("8", "IEEE-108", "Autonomous Drone Navigation in GPS-Denied Areas", "Karan Malhotra", 9, 8, 8, 9, 8, "YES", "Practical demonstration"),
    ]

    for row_idx, data in enumerate(sample_papers, start=8):
        ws2.set_row(row_idx - 1, 22)
        ws2.write(f'A{row_idx}', data[0], td_c_fmt)
        ws2.write(f'B{row_idx}', data[1], td_c_fmt)
        ws2.write(f'C{row_idx}', data[2], td_l_fmt)
        ws2.write(f'D{row_idx}', data[3], td_l_fmt)
        ws2.write(f'E{row_idx}', data[4], td_num_fmt)
        ws2.write(f'F{row_idx}', data[5], td_num_fmt)
        ws2.write(f'G{row_idx}', data[6], td_num_fmt)
        ws2.write(f'H{row_idx}', data[7], td_num_fmt)
        ws2.write(f'I{row_idx}', data[8], td_num_fmt)
        ws2.write_formula(f'J{row_idx}', f'=SUM(E{row_idx}:I{row_idx})', td_total_fmt)
        ws2.write(f'K{row_idx}', data[9], td_c_fmt)
        ws2.write(f'L{row_idx}', data[10], td_l_fmt)

    # Empty rows for manual entry
    for row_idx in range(16, 21):
        ws2.set_row(row_idx - 1, 22)
        ws2.write(f'A{row_idx}', row_idx - 7, td_c_fmt)
        ws2.write(f'B{row_idx}', "", td_c_fmt)
        ws2.write(f'C{row_idx}', "", td_l_fmt)
        ws2.write(f'D{row_idx}', "", td_l_fmt)
        ws2.write(f'E{row_idx}', "", td_num_fmt)
        ws2.write(f'F{row_idx}', "", td_num_fmt)
        ws2.write(f'G{row_idx}', "", td_num_fmt)
        ws2.write(f'H{row_idx}', "", td_num_fmt)
        ws2.write(f'I{row_idx}', "", td_num_fmt)
        ws2.write_formula(f'J{row_idx}', f'=IF(COUNT(E{row_idx}:I{row_idx})>0,SUM(E{row_idx}:I{row_idx}),"")', td_total_fmt)
        ws2.write(f'K{row_idx}', "", td_c_fmt)
        ws2.write(f'L{row_idx}', "", td_l_fmt)

    # Summary Signatures
    ws2.set_row(22, 22)
    ws2.merge_range('A23:D23', "Session Chair Name: Dr. Ananya Verma", td_l_fmt)
    ws2.merge_range('E23:H23', "Session Chair Signature: _______________________", td_l_fmt)
    ws2.merge_range('I23:L23', "Date: ____________________", td_l_fmt)

    # =========================================================================
    # SHEET 3: Session Chair Feedback for Conference
    # =========================================================================
    ws3 = workbook.add_worksheet("Conference Feedback Form")
    ws3.set_margins(0.5, 0.5, 0.5, 0.5)
    ws3.set_paper(9) # A4
    ws3.fit_to_pages(1, 1)

    ws3.set_column('A:A', 5)
    ws3.set_column('B:B', 42)
    ws3.set_column('C:C', 16)
    ws3.set_column('D:D', 18)
    ws3.set_column('E:E', 25)

    ws3.merge_range('A2:E2', "IEEE INTERNATIONAL CONFERENCE", title_fmt)
    ws3.merge_range('A3:E3', "SESSION CHAIR — CONFERENCE FEEDBACK & EVALUATION FORM", subtitle_fmt)
    ws3.set_row(1, 24)
    ws3.set_row(2, 20)

    # Metadata
    ws3.set_row(4, 20)
    ws3.write('A5', "Chair Name:", meta_label_fmt)
    ws3.merge_range('B5:C5', "Dr. Ananya Verma", meta_val_fmt)
    ws3.write('D5', "Date:", meta_label_fmt)
    ws3.write('E5', "2026-10-15", meta_val_fmt)

    ws3.set_row(5, 20)
    ws3.write('A6', "Institution:", meta_label_fmt)
    ws3.merge_range('B6:C6', "National Institute of Technology", meta_val_fmt)
    ws3.write('D6', "Session Chaired:", meta_label_fmt)
    ws3.write('E6', "Track 1 - Technical Session 2A", meta_val_fmt)

    # Feedback Parameters Table
    ws3.set_row(7, 26)
    ws3.write('A8', "No.", th_fmt)
    ws3.write('B8', "Conference Parameter", th_fmt)
    ws3.write('C8', "Maximum Marks", th_fmt)
    ws3.write('D8', "Rating Awarded", th_fmt)
    ws3.write('E8', "Specific Observations / Notes", th_fmt)

    conf_params = [
        ("1", "Session Planning & Coordination", 10, 9, "Session schedules and paper flow were well organized."),
        ("2", "Presentation & Time Management", 10, 9, "Presenters adhered to the 15-minute slot effectively."),
        ("3", "Technical/AV & Infrastructure Support", 10, 8, "Projection and mic worked well; hybrid link was stable."),
        ("4", "Participant & Presenter Management", 10, 9, "High audience engagement and smooth presenter transitions."),
        ("5", "Overall Conference Organization & Support", 10, 9, "Student volunteers and logistics desk were exceptionally helpful.")
    ]

    for idx, (no, param, max_m, awarded, rem) in enumerate(conf_params, start=9):
        ws3.set_row(idx - 1, 24)
        ws3.write(f'A{idx}', no, td_c_fmt)
        ws3.write(f'B{idx}', param, td_l_fmt)
        ws3.write(f'C{idx}', max_m, td_c_fmt)
        ws3.write(f'D{idx}', awarded, td_num_fmt)
        ws3.write(f'E{idx}', rem, td_l_fmt)

    # Total Row
    ws3.set_row(13, 26)
    ws3.merge_range('A14:B14', "Total Conference Rating", td_total_label_fmt)
    ws3.write('C14', 50, td_total_fmt)
    ws3.write_formula('D14', '=SUM(D9:D13)', td_total_fmt)
    ws3.write('E14', "(Evaluated out of 50 Marks)", td_c_fmt)

    # Qualitative Feedback
    ws3.set_row(15, 20)
    ws3.merge_range('A16:E16', "QUALITATIVE FEEDBACK & RECOMMENDATIONS FOR FUTURE CONFERENCES", section_h_fmt)

    ws3.set_row(16, 30)
    ws3.merge_range('A17:E17', "1. Key Highlights & Strengths:\n"
                               "The student volunteer support was proactive. Audiovisuals and hybrid virtual rooms were seamless.", td_l_fmt)

    ws3.set_row(17, 30)
    ws3.merge_range('A18:E18', "2. Areas for Enhancement / Suggestions:\n"
                               "Ensure buffer of 5 minutes between parallel sessions to accommodate Q&A overflow.", td_l_fmt)

    ws3.set_row(19, 22)
    ws3.merge_range('A20:B20', "Session Chair Signature: ____________________________", td_l_fmt)
    ws3.merge_range('C20:E20', "Submission Date: ________________________", td_l_fmt)

    # =========================================================================
    # SHEET 4: Scoring Rubric & Guidelines
    # =========================================================================
    ws4 = workbook.add_worksheet("Scoring Rubrics & Guidelines")
    ws4.set_margins(0.5, 0.5, 0.5, 0.5)
    ws4.set_landscape()

    ws4.set_column('A:A', 5)
    ws4.set_column('B:B', 25)
    ws4.set_column('C:C', 22)
    ws4.set_column('D:D', 22)
    ws4.set_column('E:E', 22)
    ws4.set_column('F:F', 22)
    ws4.set_column('G:G', 22)

    ws4.merge_range('A2:G2', "IEEE CONFERENCE EVALUATION BENCHMARKS & SCORING RUBRICS", title_fmt)
    ws4.merge_range('A3:G3', "Comprehensive Guidelines for 10-Mark Assessment Criteria", subtitle_fmt)
    ws4.set_row(1, 24)
    ws4.set_row(2, 18)

    ws4.set_row(4, 26)
    ws4.write('A5', "No.", rubric_h_fmt)
    ws4.write('B5', "Evaluation Parameter", rubric_h_fmt)
    ws4.write('C5', "Outstanding (9 - 10)", rubric_h_fmt)
    ws4.write('D5', "Good (7 - 8)", rubric_h_fmt)
    ws4.write('E5', "Average (5 - 6)", rubric_h_fmt)
    ws4.write('F5', "Below Average (3 - 4)", rubric_h_fmt)
    ws4.write('G5', "Inadequate (0 - 2)", rubric_h_fmt)

    presentation_rubrics = [
        ("1", "Relevance, Significance & Novelty",
         "Breakthrough research with profound contribution and major real-world / IEEE relevance.",
         "Sound original contribution with clear industrial or academic significance.",
         "Incremental improvement over known techniques; moderate novelty.",
         "Limited originality; highly standard work with little practical relevance.",
         "No discernible novelty; outdated or plagiarized ideas."),
        ("2", "Technical Quality & Methodology",
         "Mathematically sound, rigorous experimental design, flawless validation & depth.",
         "Solid technical formulation, adequate controls, valid assumptions and test suites.",
         "Basic methodology sound, but lacks exhaustive edge case or ablation validation.",
         "Weak methodology, noticeable flaws in analysis or theoretical reasoning.",
         "Fundamentally flawed methodology, invalid proofs or unverified claims."),
        ("3", "Results & Research Contribution",
         "Extensive benchmarks vs state-of-the-art; statistically significant findings.",
         "Clear experimental results with good comparative baselines and insights.",
         "Results presented but comparisons are sparse or metrics poorly justified.",
         "Inconclusive data, sparse results, or insufficient experimental evidence.",
         "Unsubstantiated claims with virtually no reproducible results."),
        ("4", "Presentation Quality & Clarity",
         "Masterful delivery, exemplary visual aids, precise timing, and engaging pacing.",
         "Well-structured presentation, clear slides, confident delivery within time.",
         "Understandable delivery, but slides are dense or pacing occasionally uneven.",
         "Rushed or sluggish, poor slide design, exceeded time limit significantly.",
         "Disorganized, inaudible, unintelligible slides, serious timing breach."),
        ("5", "Q&A / Subject Knowledge",
         "Authoritative mastery, insightful replies, handles tough critiques effortlessly.",
         "Thorough knowledge, answers questions convincingly and politely.",
         "Answers standard questions adequately; struggles with deeper theoretical queries.",
         "Superficial understanding, evasive answers, lacks depth on key concepts.",
         "Unable to answer fundamental domain questions or defend research.")
    ]

    for r_idx, (no, param, r_out, r_good, r_avg, r_below, r_poor) in enumerate(presentation_rubrics, start=6):
        ws4.set_row(r_idx - 1, 48)
        ws4.write(f'A{r_idx}', no, td_c_fmt)
        ws4.write(f'B{r_idx}', param, td_l_fmt)
        ws4.write(f'C{r_idx}', r_out, rubric_body_fmt)
        ws4.write(f'D{r_idx}', r_good, rubric_body_fmt)
        ws4.write(f'E{r_idx}', r_avg, rubric_body_fmt)
        ws4.write(f'F{r_idx}', r_below, rubric_body_fmt)
        ws4.write(f'G{r_idx}', r_poor, rubric_body_fmt)

    # Conference Feedback Rubrics
    ws4.set_row(12, 22)
    ws4.merge_range('A13:G13', "CONFERENCE ORGANIZATION & SUPPORT RUBRIC BENCHMARKS", section_h_fmt)

    conf_rubrics = [
        ("1", "Session Planning & Coordination",
         "Impeccable schedule alignment, proactive communication, timely logistics.",
         "Well organized, minor schedule deviations handled smoothly.",
         "Acceptable scheduling, slight delays or minor communication hiccups.",
         "Disorganized session flow, significant delays, lack of coordination.",
         "Chaotic scheduling, missing papers, severe lack of communication."),
        ("2", "Presentation & Time Management",
         "Strict adherence to schedule, perfect time alerts, optimal session duration.",
         "Good timekeeping, timely reminders to authors, minor drift.",
         "Moderate time discipline; some presentations ran overtime.",
         "Poor time management; session ran severely over allotted slot.",
         "No time control; chaos in speaker transitions and session breakdown."),
        ("3", "Technical/AV & Infrastructure Support",
         "Flawless display, crystal-clear audio, zero lag in hybrid streaming.",
         "Smooth projection and audio; minor AV glitches resolved promptly.",
         "Working AV but occasional microphone feedback or screen glitches.",
         "Frequent AV breakdowns, inadequate technical support assistance.",
         "AV failure, inoperable projection/audio, no IT help available."),
        ("4", "Participant & Presenter Management",
         "All presenters present and registered; high audience engagement.",
         "Most presenters on time, active Q&A participation encouraged.",
         "Adequate attendance; minor gaps in presenter attendance tracking.",
         "Multiple no-show presenters without notice; sparse audience interaction.",
         "Severe disruption, missing presenters, hostile or chaotic audience."),
        ("5", "Overall Conference Organization & Support",
         "World-class hospitality, helpful volunteers, stellar event management.",
         "Professional conference environment, helpful secretariat support.",
         "Standard conference logistics with basic amenities satisfied.",
         "Disorganized front desk, unhelpful staff, lack of basic amenities.",
         "Grossly mismanaged conference logistics, unprofessional experience.")
    ]

    for r_idx, (no, param, r_out, r_good, r_avg, r_below, r_poor) in enumerate(conf_rubrics, start=14):
        ws4.set_row(r_idx - 1, 48)
        ws4.write(f'A{r_idx}', no, td_c_fmt)
        ws4.write(f'B{r_idx}', param, td_l_fmt)
        ws4.write(f'C{r_idx}', r_out, rubric_body_fmt)
        ws4.write(f'D{r_idx}', r_good, rubric_body_fmt)
        ws4.write(f'E{r_idx}', r_avg, rubric_body_fmt)
        ws4.write(f'F{r_idx}', r_below, rubric_body_fmt)
        ws4.write(f'G{r_idx}', r_poor, rubric_body_fmt)

    workbook.close()
    print(f"Successfully generated: {output_path}")

if __name__ == "__main__":
    create_ieee_sheets()
