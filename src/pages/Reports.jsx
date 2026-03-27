import { useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Button, Chip } from '@mui/material';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { useInventory } from '../store/InventoryContext';
import { startOfDay, startOfWeek, startOfMonth, startOfYear, isWithinInterval, parseISO, subMonths } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Reports() {
  const { products, transactions } = useInventory();
  
  const [reportType, setReportType] = useState('MONTH');
  const [selectedProduct, setSelectedProduct] = useState('ALL');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // filter tx by date
  const timeFilteredTransactions = useMemo(() => {
    const now = new Date();
    
    return transactions.filter(t => {
      const tDate = parseISO(t.date);
      let isValidTime = true;

      switch (reportType) {
        case 'DAY':
          isValidTime = tDate >= startOfDay(now);
          break;
        case 'WEEK':
          isValidTime = tDate >= startOfWeek(now);
          break;
        case 'MONTH':
          isValidTime = tDate >= startOfMonth(now);
          break;
        case 'YEAR':
          isValidTime = tDate >= startOfYear(now);
          break;
        case '6_MONTHS':
          isValidTime = tDate >= subMonths(now, 6);
          break;
        case 'CUSTOM':
          if (customStart && customEnd) {
            isValidTime = isWithinInterval(tDate, { start: new Date(customStart), end: new Date(customEnd + 'T23:59:59') });
          } else {
            isValidTime = true;
          }
          break;
        case 'ALL':
        default:
          isValidTime = true;
      }
      return isValidTime;
    });
  }, [transactions, reportType, customStart, customEnd]);

  // make report data
  const reportData = useMemo(() => {
    let data = [];
    const productsToProcess = selectedProduct === 'ALL' 
      ? products 
      : products.filter(p => p.id === selectedProduct);

    if (reportType === 'YEAR') {
      const year = new Date().getFullYear();
      productsToProcess.forEach(product => {
        const prodTx = timeFilteredTransactions.filter(t => t.productId === product.id);
        for (let m = 0; m < 12; m++) {
          const monthTx = prodTx.filter(t => parseISO(t.date).getMonth() === m);
          let totalIn = 0;
          let totalOut = 0;
          monthTx.forEach(t => {
            if (t.type === 'IN') totalIn += t.quantity;
            else if (t.type === 'OUT') totalOut += t.quantity;
          });
          
          const monthName = new Date(year, m).toLocaleString('default', { month: 'short' });
          data.push({
            id: `${product.id}-y-${m}`,
            name: product.name,
            category: product.category,
            sku: product.sku,
            period: `${monthName} ${year}`,
            inward: totalIn,
            outward: totalOut,
            unitQuantity: product.unitQuantity
          });
        }
      });
    } else if (reportType === 'ALL') {
      let minDate = new Date();
      let maxDate = new Date();
      if (transactions.length > 0) {
        minDate = parseISO(transactions[transactions.length - 1].date);
        transactions.forEach(t => {
          const d = parseISO(t.date);
          if (d < minDate) minDate = d;
          if (d > maxDate) maxDate = d;
        });
      }

      productsToProcess.forEach(product => {
        const prodTx = transactions.filter(t => t.productId === product.id);
        let curr = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
        
        while (curr <= end) {
          const y = curr.getFullYear();
          const m = curr.getMonth();
          const monthTx = prodTx.filter(t => {
            const d = parseISO(t.date);
            return d.getFullYear() === y && d.getMonth() === m;
          });
          
          let totalIn = 0;
          let totalOut = 0;
          monthTx.forEach(t => {
            if (t.type === 'IN') totalIn += t.quantity;
            else if (t.type === 'OUT') totalOut += t.quantity;
          });
          
          const monthName = curr.toLocaleString('default', { month: 'short' });
          data.push({
             id: `${product.id}-${y}-${m}`,
             name: product.name,
             sku: product.sku,
             category: product.category,
             period: `${monthName} ${y}`,
             inward: totalIn,
             outward: totalOut,
             unitQuantity: product.unitQuantity
          });
          curr.setMonth(curr.getMonth() + 1);
        }
      });
    } else {
      productsToProcess.forEach(product => {
        const prodTx = timeFilteredTransactions.filter(t => t.productId === product.id);
        let totalIn = 0;
        let totalOut = 0;
        prodTx.forEach(t => {
          if (t.type === 'IN') totalIn += t.quantity;
          else if (t.type === 'OUT') totalOut += t.quantity;
        });

        const types = { 'DAY': 'Today', 'WEEK': 'This Week', 'MONTH': 'This Month', '6_MONTHS': 'Last 6 Months', 'CUSTOM': `${customStart} to ${customEnd}` };
        
        data.push({
          id: product.id,
          name: product.name,
          category: product.category,
          sku: product.sku,
          period: types[reportType] || 'Overall',
          inward: totalIn,
          outward: totalOut,
          unitQuantity: product.unitQuantity
        });
      });
    }

    return data;
  }, [products, timeFilteredTransactions, transactions, selectedProduct, reportType, customStart, customEnd]);

  const getSubTitle = () => {
    const types = {
      'DAY': 'Today',
      'WEEK': 'This Week',
      'MONTH': 'This Month',
      'YEAR': 'This Year',
      '6_MONTHS': 'Last 6 Months',
      'ALL': 'All Time',
      'CUSTOM': `${customStart} to ${customEnd}`,
    };
    return `Period: ${types[reportType]} | Product: ${selectedProduct === 'ALL' ? 'All Products' : products.find(p => p.id === selectedProduct)?.name}`;
  };

  const exportExcel = () => {
    const formattedData = reportData.map(row => ({
      'Item Name': row.name,
      'SKU': row.sku,
      'Category': row.category,
      'Period': row.period,
      'Initial Quantity': Math.max(0, row.unitQuantity - row.inward + row.outward),
      'Quantity In': row.inward,
      'Quantity Out': row.outward,
      'Final Quantity in Unit': row.unitQuantity
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");
    
    XLSX.writeFile(workbook, `Inventory_Report_${reportType}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Inventory Status Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(getSubTitle(), 14, 30);

    const tableColumn = ["Item Name", "SKU", "Category", "Period", "Initial Quantity", "Quantity In", "Quantity Out", "Final Quantity in Unit"];
    const tableRows = [];

    reportData.forEach(row => {
      const rowData = [
        row.name,
        row.sku,
        row.category,
        row.period,
        Math.max(0, row.unitQuantity - row.inward + row.outward).toString(),
        row.inward.toString(),
        row.outward.toString(),
        row.unitQuantity.toString()
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`Inventory_Report_${reportType}.pdf`);
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FileText size={28} />
            Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate and export custom inventory reports.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<FileSpreadsheet size={18} />}
            onClick={exportExcel}
            sx={{ bgcolor: 'background.paper' }}
          >
            Excel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            startIcon={<Download size={18} />}
            onClick={exportPDF}
          >
            PDF
          </Button>
        </Box>
      </Box>

      {/* filter box */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Report Period</InputLabel>
              <Select
                value={reportType}
                label="Report Period"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="DAY">Day-wise (Today)</MenuItem>
                <MenuItem value="WEEK">Week-wise (This Week)</MenuItem>
                <MenuItem value="MONTH">Month-wise (This Month)</MenuItem>
                <MenuItem value="6_MONTHS">6 Months</MenuItem>
                <MenuItem value="YEAR">Year-wise (This Year)</MenuItem>
                <MenuItem value="CUSTOM">Custom Date Range</MenuItem>
                <MenuItem value="ALL">All Time (First to Last)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Product</InputLabel>
              <Select
                value={selectedProduct}
                label="Product"
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <MenuItem value="ALL">All Products</MenuItem>
                {products.map(p => (
                  <MenuItem key={p.id} value={p.id}>{p.name} ({p.sku})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {reportType === 'CUSTOM' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Card>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Report Preview</Typography>
        <Typography variant="body2" color="text.secondary">{getSubTitle()}</Typography>
      </Box>

      <Grid container spacing={3}>
        {reportData.map((row) => (
          <Grid item xs={12} sm={6} md={4} key={row.id}>
            <Card sx={{ borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography fontWeight="bold" variant="h6">{row.name}</Typography>
                    <Typography variant="body2" color="text.secondary">SKU: {row.sku} | {row.category}</Typography>
                  </Box>
                  <Chip label={row.period} size="small" color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                </Box>
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Initial Quantity</Typography>
                    <Typography fontWeight="bold" fontSize="1.1rem">
                      {Math.max(0, row.unitQuantity - row.inward + row.outward)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Quantity In</Typography>
                    <Typography fontWeight="bold" color="success.main" fontSize="1.1rem">
                      +{row.inward}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Quantity Out</Typography>
                    <Typography fontWeight="bold" color="error.main" fontSize="1.1rem">
                      -{row.outward}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Final Quantity</Typography>
                    <Typography fontWeight="bold" fontSize="1.1rem">{row.unitQuantity}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {reportData.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">No products found for this criteria.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
