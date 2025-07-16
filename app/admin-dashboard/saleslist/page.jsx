"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../_components/adminNavbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export default function SalesList() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("daily");
  const [autoScale, setAutoScale] = useState(true);
  const [headerRevenueRange, setHeaderRevenueRange] = useState("monthly");
  const [currentTime, setCurrentTime] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Handle client-side time display to prevent hydration error
  useEffect(() => {
    setIsClient(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load orders from localStorage (or use sample data)
  useEffect(() => {
    const loadOrdersData = () => {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders);
      } else {
        setOrders(generateSampleData());
      }
    };

    loadOrdersData();
  }, []);

  // Generate sample data based on current system date
  const generateSampleData = () => {
    const currentDate = new Date();
    const sampleOrders = [];

    for (let i = 14; i >= 0; i--) {
      const orderDate = new Date(currentDate);
      orderDate.setDate(currentDate.getDate() - i);

      const numOrders = Math.floor(Math.random() * 5) + 1;

      for (let j = 0; j < numOrders; j++) {
        const orderTime = new Date(orderDate);
        orderTime.setHours(Math.floor(Math.random() * 12) + 9);
        orderTime.setMinutes(Math.floor(Math.random() * 60));

        const menuItems = [
          ["pizza", "garlic bread", "coke"],
          ["burger", "fries", "milkshake"],
          ["pasta", "salad", "iced tea"],
          ["chicken tikka", "naan", "lassi"],
          ["biryani", "raita", "pickle"],
          ["sandwich", "chips", "juice"],
          ["dosa", "sambar", "chutney"],
          ["momos", "sauce", "soup"],
          ["pizza", "fries", "pepsi"],
          ["burger", "onion rings", "coke"],
        ];

        const customers = [
          "John Doe", "Alice Smith", "Bob Johnson", "Emma Wilson", "Mike Davis",
          "Sarah Connor", "Tom Hardy", "Jennifer Lopez", "Robert Smith", "Lisa Johnson",
          "David Wilson", "Maria Garcia", "James Brown", "Anna Taylor", "Chris Lee",
        ];

        const randomItems = menuItems[Math.floor(Math.random() * menuItems.length)];
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
        const randomTotal = (Math.random() * 40 + 15).toFixed(2);

        sampleOrders.push({
          id: `ORD-${String(sampleOrders.length + 1).padStart(3, "0")}`,
          customerName: randomCustomer,
          items: randomItems,
          total: parseFloat(randomTotal),
          orderTime: orderTime.toISOString(),
          status: "delivered",
          phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        });
      }
    }

    return sampleOrders;
  };

  const deliveredOrders = orders.filter(order => order.status === "delivered");

  // Helper function to generate report HTML for PDF
  const generateReportHTML = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });

    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;
    const popularItems = getItemPopularityData();
    const salesData = getSalesData();

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background: white; padding: 40px;">
        <!-- Header Section -->
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; border-bottom: 3px solid #f59e0b;">
          <h1 style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">KhanaBuddy</h1>
          <h2 style="font-size: 28px; color: #f59e0b; margin-bottom: 10px;">Sales Analytics Report</h2>
          <p style="font-size: 16px; color: #6b7280;">Generated on: ${currentDate} | Analysis Period: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</p>
        </div>

        <!-- Executive Summary -->
        <div style="margin: 40px 0;">
          <h3 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Executive Summary</h3>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin-bottom: 40px;">
            <div style="background: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #1f2937;">₹${totalRevenue.toFixed(2)}</div>
              <div style="font-size: 16px; color: #6b7280; margin-top: 8px;">Total Revenue</div>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #1f2937;">${deliveredOrders.length}</div>
              <div style="font-size: 16px; color: #6b7280; margin-top: 8px;">Total Orders</div>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #1f2937;">₹${avgOrderValue.toFixed(2)}</div>
              <div style="font-size: 16px; color: #6b7280; margin-top: 8px;">Average Order Value</div>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #1f2937;">${popularItems.length}</div>
              <div style="font-size: 16px; color: #6b7280; margin-top: 8px;">Menu Items Sold</div>
            </div>
          </div>
        </div>

        <!-- Sales Analysis -->
        <div style="margin: 40px 0;">
          <h3 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Sales Performance Analysis</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
            <div style="background: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h4 style="font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 20px;">Revenue Trends (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})</h4>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Period</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Revenue</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  ${salesData.map((item, index) => {
                    const growth = index > 0 ? ((item.revenue - salesData[index-1].revenue) / salesData[index-1].revenue * 100).toFixed(1) : 0;
                    return `
                      <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${formatPrintDate(item.date)}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">₹${item.revenue.toFixed(2)}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${growth}%</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
              <h4 style="font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 20px;">Top Performing Items</h4>
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Item</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Orders</th>
                    <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Share</th>
                  </tr>
                </thead>
                <tbody>
                  ${popularItems.map(item => {
                    const total = popularItems.reduce((sum, i) => sum + i.value, 0);
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    return `
                      <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.value}</td>
                        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${percentage}%</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Key Insights -->
        <div style="margin: 40px 0; background: #fef3c7; padding: 30px; border-radius: 12px; border: 1px solid #f59e0b;">
          <h3 style="font-size: 22px; font-weight: bold; color: #92400e; margin-bottom: 20px;">Key Business Insights</h3>
          
          <div style="margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>Revenue Performance:</strong> 
            ${totalRevenue > 1000 ? 'Strong' : 'Moderate'} revenue generation with ₹${totalRevenue.toFixed(2)} total sales across ${deliveredOrders.length} orders.
          </div>
          
          <div style="margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>Customer Behavior:</strong> 
            Average order value of ₹${avgOrderValue.toFixed(2)} indicates ${avgOrderValue > 25 ? 'healthy' : 'opportunity for upselling'} customer spending patterns.
          </div>
          
          <div style="margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>Menu Performance:</strong> 
            ${popularItems[0]?.name || 'Pizza'} is the top-selling item with ${popularItems[0]?.value || 0} orders, representing significant customer preference.
          </div>
          
          <div style="margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>Growth Opportunities:</strong> 
            ${salesData.length > 1 && salesData[salesData.length-1].revenue > salesData[salesData.length-2].revenue ? 'Positive' : 'Stable'} trend in recent sales performance suggests ${salesData.length > 1 && salesData[salesData.length-1].revenue > salesData[salesData.length-2].revenue ? 'continued growth potential' : 'need for promotional activities'}.
          </div>
        </div>

        <!-- Strategic Recommendations -->
        <div style="margin: 40px 0; page-break-before: always;">
          <h3 style="font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Strategic Recommendations</h3>
          
          <div style="margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>1. Menu Optimization:</strong> Focus on promoting top-performing items while analyzing underperforming products for potential removal or recipe enhancement.
          </div>
          
          <div style="margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>2. Revenue Enhancement:</strong> ${avgOrderValue < 25 ? 'Implement bundle deals and combo offers to increase average order value.' : 'Maintain current pricing strategy while exploring premium options.'}
          </div>
          
          <div style="margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>3. Customer Retention:</strong> Develop loyalty programs based on popular items and peak ordering patterns identified in the analysis.
          </div>
          
          <div style="margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>4. Operational Efficiency:</strong> Optimize inventory management based on item popularity trends to reduce waste and ensure availability.
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 60px; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
          <p style="margin: 5px 0;">This report was generated automatically by KhanaBuddy Analytics System</p>
          <p style="margin: 5px 0;">For questions or additional analysis, contact: support@khanabuddy.com</p>
          <p style="margin: 5px 0;">© 2024 KhanaBuddy. All rights reserved.</p>
        </div>
      </div>
    `;
  };

  // Direct PDF generation function
  const generateDirectPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });
      
      // Create a temporary div with the report content
      const reportElement = document.createElement('div');
      reportElement.innerHTML = generateReportHTML();
      reportElement.style.width = '794px'; // A4 width in pixels at 96 DPI
      reportElement.style.position = 'absolute';
      reportElement.style.left = '-9999px';
      reportElement.style.top = '0';
      
      document.body.appendChild(reportElement);
      
      // Convert to canvas then PDF
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        height: reportElement.scrollHeight,
        width: reportElement.scrollWidth
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Clean up
      document.body.removeChild(reportElement);
      
      // Download the PDF
      const currentDate = new Date().toISOString().split('T')[0];
      pdf.save(`KhanaBuddy-Sales-Report-${currentDate}.pdf`);
      
      setIsGeneratingPDF(false);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      setIsGeneratingPDF(false);
      
      // Show error message
      alert('PDF generation failed. Please try the preview option instead.');
      
      // Fallback to current method
      handlePrint();
    }
  };

  // Enhanced print functionality for structured PDF (Preview & Print)
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    const currentDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });

    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;
    const popularItems = getItemPopularityData();
    const salesData = getSalesData();

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>KhanaBuddy - Sales Analytics Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f9fafb;
          }
          
          .preview-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #1f2937;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .preview-title {
            font-size: 18px;
            font-weight: bold;
          }
          
          .preview-actions {
            display: flex;
            gap: 10px;
          }
          
          .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
          }
          
          .btn-primary {
            background: #3b82f6;
            color: white;
          }
          
          .btn-primary:hover {
            background: #2563eb;
          }
          
          .btn-secondary {
            background: #6b7280;
            color: white;
          }
          
          .btn-secondary:hover {
            background: #4b5563;
          }
          
          .preview-container {
            max-width: 210mm;
            margin: 80px auto 20px;
            padding: 20px;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          
          .print-container {
            padding: 20mm;
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            border-bottom: 3px solid #f59e0b;
          }
          
          .company-name {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          
          .report-title {
            font-size: 24px;
            color: #f59e0b;
            margin-bottom: 5px;
          }
          
          .report-date {
            font-size: 14px;
            color: #6b7280;
          }
          
          .summary-section {
            margin: 30px 0;
            page-break-inside: avoid;
          }
          
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .stat-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            text-align: center;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
          }
          
          .stat-label {
            font-size: 14px;
            color: #6b7280;
            margin-top: 5px;
          }
          
          .analysis-section {
            margin: 30px 0;
            page-break-inside: avoid;
          }
          
          .analysis-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .chart-container {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          
          .chart-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 15px;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          
          .data-table th,
          .data-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .data-table th {
            background: #f3f4f6;
            font-weight: bold;
            color: #1f2937;
          }
          
          .insights-section {
            margin: 30px 0;
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #f59e0b;
          }
          
          .insights-title {
            font-size: 18px;
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
          }
          
          .insight-item {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 5px;
            border-left: 4px solid #f59e0b;
          }
          
          .footer {
            margin-top: 50px;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
          }
          
          @media print {
            .preview-header {
              display: none !important;
            }
            
            .preview-container {
              margin: 0;
              padding: 0;
              box-shadow: none;
              border-radius: 0;
            }
            
            .print-container {
              padding: 10mm;
            }
            
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body>
        <!-- Preview Header (only visible on screen) -->
        <div class="preview-header">
          <div class="preview-title">📊 Report Preview - KhanaBuddy Sales Analytics</div>
          <div class="preview-actions">
            <button class="btn btn-primary" onclick="window.print()">
              🖨️ Print Report
            </button>
            <button class="btn btn-secondary" onclick="window.close()">
              ✕ Close Preview
            </button>
          </div>
        </div>

        <div class="preview-container">
          <div class="print-container">
            <!-- Header Section -->
            <div class="report-header">
              <div class="company-name">KhanaBuddy</div>
              <div class="report-title">Sales Analytics Report</div>
              <div class="report-date">Generated on: ${currentDate} | Analysis Period: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</div>
            </div>

            <!-- Executive Summary -->
            <div class="summary-section">
              <div class="section-title">Executive Summary</div>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">₹${totalRevenue.toFixed(2)}</div>
                  <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${deliveredOrders.length}</div>
                  <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">₹${avgOrderValue.toFixed(2)}</div>
                  <div class="stat-label">Average Order Value</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${popularItems.length}</div>
                  <div class="stat-label">Menu Items Sold</div>
                </div>
              </div>
            </div>

            <!-- Sales Analysis -->
            <div class="analysis-section">
              <div class="section-title">Sales Performance Analysis</div>
              <div class="analysis-grid">
                <div class="chart-container">
                  <div class="chart-title">Revenue Trends (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})</div>
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Revenue</th>
                        <th>Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${salesData.map((item, index) => {
                        const growth = index > 0 ? ((item.revenue - salesData[index-1].revenue) / salesData[index-1].revenue * 100).toFixed(1) : 0;
                        return `
                          <tr>
                            <td>${formatPrintDate(item.date)}</td>
                            <td>₹${item.revenue.toFixed(2)}</td>
                            <td>${growth}%</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
                
                <div class="chart-container">
                  <div class="chart-title">Top Performing Items</div>
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Orders</th>
                        <th>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${popularItems.map(item => {
                        const total = popularItems.reduce((sum, i) => sum + i.value, 0);
                        const percentage = ((item.value / total) * 100).toFixed(1);
                        return `
                          <tr>
                            <td>${item.name}</td>
                            <td>${item.value}</td>
                            <td>${percentage}%</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Key Insights -->
            <div class="insights-section">
              <div class="insights-title">Key Business Insights</div>
              
              <div class="insight-item">
                <strong>Revenue Performance:</strong> 
                ${totalRevenue > 1000 ? 'Strong' : 'Moderate'} revenue generation with ₹${totalRevenue.toFixed(2)} total sales across ${deliveredOrders.length} orders.
              </div>
              
              <div class="insight-item">
                <strong>Customer Behavior:</strong> 
                Average order value of ₹${avgOrderValue.toFixed(2)} indicates ${avgOrderValue > 25 ? 'healthy' : 'opportunity for upselling'} customer spending patterns.
              </div>
              
              <div class="insight-item">
                <strong>Menu Performance:</strong> 
                ${popularItems[0]?.name || 'Pizza'} is the top-selling item with ${popularItems[0]?.value || 0} orders, representing significant customer preference.
              </div>
              
              <div class="insight-item">
                <strong>Growth Opportunities:</strong> 
                ${salesData.length > 1 && salesData[salesData.length-1].revenue > salesData[salesData.length-2].revenue ? 'Positive' : 'Stable'} trend in recent sales performance suggests ${salesData.length > 1 && salesData[salesData.length-1].revenue > salesData[salesData.length-2].revenue ? 'continued growth potential' : 'need for promotional activities'}.
              </div>
            </div>

            <!-- Recommendations -->
            <div class="page-break"></div>
            <div class="analysis-section">
              <div class="section-title">Strategic Recommendations</div>
              
              <div class="insight-item">
                <strong>1. Menu Optimization:</strong> Focus on promoting top-performing items while analyzing underperforming products for potential removal or recipe enhancement.
              </div>
              
              <div class="insight-item">
                <strong>2. Revenue Enhancement:</strong> ${avgOrderValue < 25 ? 'Implement bundle deals and combo offers to increase average order value.' : 'Maintain current pricing strategy while exploring premium options.'}
              </div>
              
              <div class="insight-item">
                <strong>3. Customer Retention:</strong> Develop loyalty programs based on popular items and peak ordering patterns identified in the analysis.
              </div>
              
              <div class="insight-item">
                <strong>4. Operational Efficiency:</strong> Optimize inventory management based on item popularity trends to reduce waste and ensure availability.
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>This report was generated automatically by KhanaBuddy Analytics System</p>
              <p>For questions or additional analysis, contact: support@khanabuddy.com</p>
              <p>© 2024 KhanaBuddy. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Focus on the new window
    printWindow.focus();
  };

  // Helper function to format dates for print
  const formatPrintDate = (dateString) => {
    const date = new Date(dateString);
    switch (timeRange) {
      case "daily":
        return date.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          timeZone: "Asia/Kolkata",
        });
      case "monthly":
        return date.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        });
      case "yearly":
        return date.getFullYear().toString();
      default:
        return dateString;
    }
  };

  // Updated function to handle both monthly and yearly revenue for header
  const getHeaderRevenue = () => {
    const currentDate = new Date();

    if (headerRevenueRange === "monthly") {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const monthlyOrders = deliveredOrders.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return (
          orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear
        );
      });

      return monthlyOrders.reduce((sum, order) => sum + order.total, 0);
    } else if (headerRevenueRange === "yearly") {
      const currentYear = currentDate.getFullYear();

      const yearlyOrders = deliveredOrders.filter((order) => {
        const orderDate = new Date(order.orderTime);
        return orderDate.getFullYear() === currentYear;
      });

      return yearlyOrders.reduce((sum, order) => sum + order.total, 0);
    }

    return 0;
  };

  const getHeaderRevenueLabel = () => {
    return headerRevenueRange === "monthly" ? "Total Revenue Monthly" : "Total Revenue Yearly";
  };

  // Process sales data for line chart
  const getSalesData = () => {
    const salesMap = new Map();

    deliveredOrders.forEach((order) => {
      const date = new Date(order.orderTime);
      let key;

      switch (timeRange) {
        case "daily":
          key = date.toISOString().split("T")[0];
          break;
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;
        case "yearly":
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toISOString().split("T")[0];
      }

      if (salesMap.has(key)) {
        salesMap.set(key, salesMap.get(key) + order.total);
      } else {
        salesMap.set(key, order.total);
      }
    });

    return Array.from(salesMap.entries())
      .map(([date, revenue]) => ({
        date,
        revenue: parseFloat(revenue.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // Fixed: Process item popularity data for pie chart
  const getItemPopularityData = () => {
    const itemCount = new Map();

    deliveredOrders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const itemName = item.toLowerCase().trim();
          itemCount.set(itemName, (itemCount.get(itemName) || 0) + 1);
        });
      }
    });

    const data = Array.from(itemCount.entries())
      .map(([name, count]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        value: count 
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return data.length > 0 ? data : [{ name: "No Data", value: 1 }];
  };

  // Calculate Y-axis domain for auto-scaling
  const getYAxisDomain = () => {
    if (!autoScale) return [0, "auto"];

    const data = getSalesData();
    if (data.length === 0) return [0, 100];

    const maxValue = Math.max(...data.map((d) => d.revenue));
    const minValue = Math.min(...data.map((d) => d.revenue));

    const padding = (maxValue - minValue) * 0.1;
    const adjustedMin = Math.max(0, minValue - padding);
    const adjustedMax = maxValue + padding;

    return [adjustedMin, adjustedMax];
  };

  const formatChartDate = (dateString) => {
    const date = new Date(dateString);
    switch (timeRange) {
      case "daily":
        return date.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          timeZone: "Asia/Kolkata",
        });
      case "monthly":
        return date.toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        });
      case "yearly":
        return date.getFullYear().toString();
      default:
        return dateString;
    }
  };

  // Enhanced color palette for pie chart
  const COLORS = [
    "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6", 
    "#F97316", "#06B6D4", "#84CC16", "#EC4899", "#6B7280",
  ];

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <AdminNavbar />

      <div className="print-area">
        <div className="print-title" style={{ display: "none" }}>
          KhanaBuddy - Sales Analytics Report
        </div>

        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Page Header */}
            <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-amber-200/50 print-header">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
                    Sales Analytics Dashboard
                  </h2>
                  <p className="text-sm text-amber-700 font-medium mt-1">
                    {isClient ? currentTime : "Loading..."}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Updated Button Section with Both Options */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrint}
                      className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd"/>
                      </svg>
                      Preview & Print
                    </button>
                    
                    {/* <button
                      onClick={generateDirectPDF}
                      disabled={isGeneratingPDF}
                      className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                          </svg>
                          Download PDF
                        </>
                      )}
                    </button> */}
                  </div>

                  <div className="text-right bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-bold text-teal-900">{getHeaderRevenueLabel()}</div>
                      <select
                        value={headerRevenueRange}
                        onChange={(e) => setHeaderRevenueRange(e.target.value)}
                        className="no-print ml-3 px-2 py-1 bg-white border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-medium text-teal-900"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="text-2xl font-black text-teal-600">
                      ₹{getHeaderRevenue().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-emerald-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-emerald-900">Total Orders</h3>
                    <p className="text-2xl font-black text-emerald-600">{deliveredOrders.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-amber-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-amber-900">Avg Order Value</h3>
                    <p className="text-2xl font-black text-amber-600">
                      ₹{deliveredOrders.length > 0 ? (deliveredOrders.reduce((sum, order) => sum + order.total, 0) / deliveredOrders.length).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-rose-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-rose-900">Total Revenue</h3>
                    <p className="text-2xl font-black text-rose-600">
                      ₹{deliveredOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 print-charts">
              {/* Sales Trend Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/50 p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-amber-900">Sales Trend</h3>
                    <p className="text-sm text-amber-700 font-medium">Revenue over time</p>
                  </div>
                  <div className="no-print flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoScale"
                        checked={autoScale}
                        onChange={(e) => setAutoScale(e.target.checked)}
                        className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                      />
                      <label htmlFor="autoScale" className="text-xs text-amber-700 font-medium">Auto Scale</label>
                    </div>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="px-4 py-2 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium text-amber-900"
                    >
                      <option value="daily">Daily</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getSalesData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FEF3C7" />
                    <XAxis dataKey="date" tickFormatter={formatChartDate} stroke="#92400E" fontSize={12} />
                    <YAxis domain={getYAxisDomain()} stroke="#92400E" fontSize={12} tickFormatter={(value) => `₹${value.toFixed(0)}`} />
                    <Tooltip
                      formatter={(value) => [`₹${value.toFixed(2)}`, "Revenue"]}
                      labelFormatter={(label) => `Date: ${formatChartDate(label)}`}
                      contentStyle={{ backgroundColor: "#FEF3C7", border: "1px solid #F59E0B", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "#F59E0B", strokeWidth: 2 }} connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Popular Items Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-200/50 p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-amber-900">Popular Items</h3>
                  <p className="text-sm text-amber-700 font-medium">Most ordered items</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getItemPopularityData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getItemPopularityData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} orders`, name]}
                      contentStyle={{ 
                        backgroundColor: "#FEF3C7", 
                        border: "1px solid #F59E0B", 
                        borderRadius: "12px", 
                        fontSize: "12px" 
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color, fontSize: '12px' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
