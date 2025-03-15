import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface MenuItem {
  name: string;
  amount: number;
  quantity?: number;
  peopleInvolved: string[];
}

interface MenuTableProps {
  menu: MenuItem[];
  people: Record<string, string>;
  isSummary?:Boolean;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({ isSummary=false, menu, people, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 1 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', position: 'sticky', left: '0', zIndex: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>Item Name</TableCell>
            <TableCell sx={{ zIndex: 1, fontWeight: 'bold' }}>Quantity</TableCell>
            <TableCell sx={{ zIndex: 1, fontWeight: 'bold' }}>Cost Per Item</TableCell>
            <TableCell sx={{ zIndex: 1, fontWeight: 'bold' }}>Total Amount</TableCell>
            {Object.entries(people).map(([id, name]) => (
              <TableCell key={id} sx={{ fontWeight: 'bold', zIndex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '102px' }}>{name}</TableCell>
            ))}
            {!isSummary && <TableCell sx={{ fontWeight: 'bold', zIndex: 1 }}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {menu.map((item, index) => {
            const costPerItem = item.quantity ? (item.amount / item.quantity).toFixed(2) : item.amount.toFixed(2);
            const quantityDisplay = item.quantity || 1;
            
            return (
              <TableRow key={index}>
                <TableCell sx={{ position: 'sticky', left: '0', zIndex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>{item.name}</TableCell>
                <TableCell>{quantityDisplay}</TableCell>
                <TableCell>{costPerItem}</TableCell>
                <TableCell>{item.amount.toFixed(2)}</TableCell>
                {Object.entries(people).map(([id, name]) => (
                  <TableCell key={id}>
                    {item.peopleInvolved.includes(id)
                      ? (item.amount / item.peopleInvolved.length).toFixed(2)
                      : '-'}
                  </TableCell>
                ))}
                {!isSummary && <TableCell sx={{display:'flex'}}>
                  <IconButton onClick={() => onEdit && onEdit(index)} aria-label="edit">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete && onDelete(index)} aria-label="delete" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MenuTable;