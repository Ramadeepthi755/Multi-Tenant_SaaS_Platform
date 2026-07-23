package com.workforce.hrm.util;

import java.awt.Color;
import java.io.ByteArrayOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.workforce.hrm.entity.Payroll;

public class PdfGenerator {

    // Logger should be declared here (Class Level)
    private static final Logger log = LoggerFactory.getLogger(PdfGenerator.class);

    public static byte[] generateSalarySlip(Payroll payroll) {

        try {

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);

            Paragraph title = new Paragraph(
                    "WORKFORCE HRM PORTAL\nSALARY SLIP\n\n",
                    titleFont);

            title.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(title);

            PdfPTable table = new PdfPTable(2);

            table.setWidthPercentage(100);

            addRow(table, "Employee Name",
                    payroll.getEmployee().getFirstName() + " "
                            + payroll.getEmployee().getLastName());

            addRow(table, "Employee ID",
                    payroll.getEmployee().getEmployeeId().toString());

            addRow(table, "Month",
                    payroll.getMonth().toString());

            addRow(table, "Year",
                    String.valueOf(payroll.getYear()));

            addRow(table, "Basic Salary",
                    "₹ " + payroll.getBasicSalary());

            addRow(table, "Allowances",
                    "₹ " + payroll.getAllowances());

            addRow(table, "Gross Salary",
                    "₹ " + payroll.getGrossSalary());

            addRow(table, "Deductions",
                    "₹ " + payroll.getDeductions());

            addRow(table, "Net Salary",
                    "₹ " + payroll.getNetSalary());

            addRow(table, "Generated On",
                    payroll.getGeneratedDate().toString());

            document.add(table);

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

            log.error("Error generating salary slip", e);

            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private static void addRow(PdfPTable table, String key, String value) {

        PdfPCell cell1 = new PdfPCell(new Paragraph(key));

        cell1.setBackgroundColor(Color.LIGHT_GRAY);

        table.addCell(cell1);

        table.addCell(value);
    }
}