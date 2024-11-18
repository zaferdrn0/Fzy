import { Divider, Skeleton, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Theme } from "@mui/material";
import React, { useEffect, useState } from "react";

/**
 * Enum for column alignment options
 * @readonly
 * @enum {string}
 */

export enum ColumnAlignment {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export interface TableColumn {
  header: string;
  width?: string;
  render: (data: any, index?: number) => string | JSX.Element;
  align?: ColumnAlignment;
  style?: SxProps | undefined;
  sort?: boolean;
  value?: string;
  type?: string
}

interface CustomTableProps {
  key?: string;
  columns: TableColumn[];
  data: any[] | string | null | undefined;
  onRowClick?: (data: any) => void;
  headRowStyle?: SxProps<Theme> | undefined;
  bodyRowStyle?: SxProps<Theme> | undefined;
  tBodyCypressId?: string;
  tableStyle?: SxProps<Theme> | undefined;
sorting?: { 
    value: boolean; 
    onApply: (property: string, order: 'asc' | 'desc') => void; 
    url: boolean;
    defaultOrder?: 'asc' | 'desc';
    defaultOrderBy?: string;
  } | undefined;
}

const LoadingIndicator: React.FC<{ columns: TableColumn[] }> = ({ columns }) => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7].map((index) => (
        <TableRow key={index}>
          {columns.map((col, colIndex) => (
            <TableCell key={colIndex} colSpan={Number(col.width) || 1}>
              <Skeleton animation="wave" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};


export const parseSort = (query: string): { field: string | null, order: "asc" | "desc" } => {
  const sortRegex = /sort_by=([^:]+):([^&]+)/;
  const match = query.match(sortRegex);
  if (match) {
    const field = match[1].trim();
    const order = match[2].trim();
    if (order === "asc" || order === "desc") {
      return { field, order };
    }
  }

  return { field: null, order: "asc" };
};

/**
 * CustomTable component renders a table with customizable columns and data.
 * 
 * @param {CustomTableProps} props - The component properties.
 * @returns {JSX.Element} The rendered table.
 */

const CustomTable: React.FC<CustomTableProps> = ({ columns, data, onRowClick, headRowStyle, bodyRowStyle, tBodyCypressId, tableStyle, sorting, key }) => {
  const [order, setOrder] = useState<'asc' | 'desc'>(sorting?.defaultOrder || 'asc');
  const [orderBy, setOrderBy] = useState<string | null>(sorting?.defaultOrderBy || null);

  const handleRequestSort = (property: string) => {
    const isAscending = orderBy === property && order === 'asc';
    setOrder(isAscending ? 'desc' : 'asc');
    setOrderBy(property);
    sorting?.onApply(property, isAscending ? 'desc' : 'asc');
  };

  useEffect(() => {
    if (sorting?.url) {
      const queryString = decodeURIComponent(window.location.search.slice(1));
      const { field, order } = parseSort(queryString);
      setOrder(order);
      setOrderBy(field);
    }
  }, [sorting]);

  return (
    <TableContainer key={key} sx={{ borderRadius: "10px !important" }}>
      <Table aria-label="custom table" sx={{ ...tableStyle }}>
        <TableHead>
          <TableRow >
            {columns.map((col, index) => (
              <TableCell
                key={index}
                align={col.align || "left"}
                sx={{
                  width: col.width,
                  ...col.style,
                  padding: "8px !important",
                  inlineSize: "min-content",
                  cursor: sorting?.value && col.value ? "pointer" : "default",
                  '&:hover': {
                    backgroundColor: sorting?.value && col.value ? "rgba(0, 0, 0, 0.1)" : undefined,
                  },
                  '&.Mui-active': {
                    backgroundColor: sorting?.value && col.value ? "rgba(0, 0, 0, 0.2)" : "inherit",
                  }
                }}
                onClick={sorting?.value && col.value ? () => handleRequestSort(col.value as string) : undefined}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>{col.header}</span>
                  {sorting?.value && col.value ? (
                    <TableSortLabel
                      active={orderBy === col.value}
                      direction={orderBy === col.value ? order : "asc"}
                    />
                  ) : null}
                </div>
                <Divider orientation="vertical" flexItem />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody data-cy={tBodyCypressId}>
          {typeof data === "string" ? (
            <LoadingIndicator columns={columns} />
          ) : (
            data?.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => {
                  if (onRowClick) {
                    onRowClick(row);
                  }
                }}
                sx={{
                  ...bodyRowStyle,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    cursor: onRowClick ? "pointer" : "default",
                  },
                }}
              >
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align={col.align || "left"}
                    sx={{
                      paddingLeft: "8px !important",
                      paddingRight: "8px !important",
                      inlineSize: "min-content",
                    }}
                  >
                    {col.render ? col.render(row, rowIndex) : row[col.header]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;