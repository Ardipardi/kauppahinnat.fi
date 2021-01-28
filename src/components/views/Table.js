import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

  // Vilkuiltu täältä mallia: https://www.freakyjolly.com/react-table-tutorial/
  export default function Table(props) {
    const [data, setData] = useState(props.sales);
    
    // Vakikolumnit kauppatiedoille
    const columns = React.useMemo(
        () => [
            // {
            //     Header: 'Kaupunki',
            //     accessor: 'kaupunki',
            // },
            {
                Header: 'Kaupunginosa',
                accessor: 'kaupunginosa',
            },
            // {
            //     Header: 'Postinumero',
            //     accessor: 'postinumero',
            // },
            // {
            //     Header: 'Huonelukumäärä',
            //     accessor: 'huoneLukumaara',
            //     Filter: SelectColumnFilter,
            //     filter: 'equals'
            // },
            {
                Header: 'Huoneisto',
                accessor: 'huoneisto',
            },
            {
                Header: 'Talotyyppi',
                accessor: 'talotyyppi',
                Filter: SelectColumnFilter,
                filter: 'equals',
            },
            {
                Header: 'Pinta-ala',
                accessor: 'pintaAla',
                // Rangefiltteri ei toimi tässä, koska Suomilocale floateille on pilkku eikä piste.
                // JavaScript ei osaa tehdä käännöstä oikein, enkä tähän väliin ehdi asiaa selvitellä.
                // Filter: NumberRangeColumnFilter,
                // filter: 'between',
                Filter: SelectColumnFilter,
                filter: 'equals',
            },
            {
                Header: 'Velaton hinta',
                accessor: 'velatonHinta',
                Filter: NumberRangeColumnFilter,
                filter: 'between',
            },
            {
                Header: 'Hinta per neliö',
                accessor: 'hintaPerNelio',
                Filter: NumberRangeColumnFilter,
                filter: 'between',
            },
            {
                Header: 'Rakennusvuosi',
                accessor: 'rakennusvuosi',
                Filter: NumberRangeColumnFilter,
                filter: 'between',
            },
            {
                Header: 'Kerros',
                accessor: 'kerros',
                Filter: SelectColumnFilter,
                filter: 'equals',
            },
            {
                Header: 'Hissi',
                accessor: 'hissi',
                Filter: SelectColumnFilter,
                filter: 'equals',
            },
            {
                Header: 'Kunto',
                accessor: 'kunto',
                Filter: SelectColumnFilter,
                filter: 'equals',
            },
            {
                Header: 'Tontti',
                accessor: 'tontti',
                Filter: SelectColumnFilter,
                filter: 'equals',
            },
            {
                Header: 'Energialuokka',
                accessor: 'energialuokka',
                Filter: SelectColumnFilter,
                filter: 'equals',
            }
        ], []
    )

    const filterTypes = React.useMemo(
        () => ({
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                const rowValue = row.values[id]
                return rowValue !== undefined
                    ? String(rowValue)
                        .split(',')[0]
                        .toLowerCase()
                        .startsWith(String(filterValue).toLowerCase())
                    : true
                })
            },
        }),
        []
      )

    const defaultColumn = React.useMemo(
        () => ({
            // Vakiofiltteri kentille
            Filter: DefaultColumnFilter,
        }),
        []
      )
  
    const { 
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter, 
    } = useTable({
            columns,
            data,
            defaultColumn,
            filterTypes, 
    },
    useFilters,
    useGlobalFilter,
    );

    useEffect(() => {
        let roomInfo = "Kaikki";
        let salesData = [];

        // Tee asuntokoon filtteröintiparametri
        if(props.room === "Yksiöt"){
            roomInfo = "1";
        }
        else if(props.room === "Kaksiot"){
            roomInfo = "2";
        }
        else if(props.room === "Kolmiot"){
            roomInfo = "3";
        }
        else if(props.room === "4+ huonetta"){
            roomInfo = "4+";
        }
        
        // Filtteröi parametrin mukaan dataa
        if (roomInfo === "Kaikki"){
            salesData = props.sales;
        }
        else{
            salesData = props.sales.filter(
                (e) => e.huoneLukumaaraV2 === roomInfo);
        }
        
        setData(salesData);
    }, [props.room]);

    /********** FILTTERIT ***********/
    // https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/filtering?file=/src/App.js:6247-6319

    // Vakiofiltteri taulukolle
    function GlobalFilter({
        preGlobalFilteredRows,
        globalFilter,
        setGlobalFilter,
    }) {
        const count = preGlobalFilteredRows.length
        const [value, setValue] = React.useState(globalFilter)
        const onChange = useAsyncDebounce(value => {
          setGlobalFilter(value || undefined)
        }, 200)
      
        return (
          <span>
            Hae:{' '}
            <input
              value={value || ""}
              onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={`${count} asuntokaupasta...`}
              style={{
                fontSize: '1rem',
                border: '0',
              }}
            />
          </span>
        )
    }

    // Vakiofiltterin määritys
    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        return (
            <input
                value={filterValue || ''}
                onChange={e => {
                setFilter(e.target.value || undefined)
                }}
                placeholder={`Hae...`}
            />
        )
    }

    // Dropdown-filtteri columnin arvoille; toimii dynaamisesti
    function SelectColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id },
    }) {
        // Selvitetään fiiltteröinnin valintavaihtoehdot preFilteredRows:n avulla
        const options = React.useMemo(() => {
            const options = new Set()
            preFilteredRows.forEach(row => {
                options.add(row.values[id])
            })

            return [...options.values()]
        }, [id, preFilteredRows])
    
        // Renderöidään monivalinta
        return (
            <select
                value={filterValue}
                onChange={e => {
                setFilter(e.target.value || undefined)
                }}
            >
                <option value="">Kaikki</option>
                {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
                ))}
            </select>
        )
    }

    // Filtteri, johon asetetaan numeroarvoina lähtöarvo ja päättymisarvo
    function NumberRangeColumnFilter({
        column: { filterValue = [], setFilter },
    }) {
        return (
            <div
                style={{
                display: 'block',
                }}
            >
            <input
                value={filterValue[0] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value;
                    setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
                }}
                placeholder={`Mistä`}
                style={{
                    width: '65px',
                    marginRight: '0.5rem',
                }}
            />
            -
            <input
                value={filterValue[1] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value;
                    setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
                }}
                placeholder={`Mihin`}
                style={{
                    width: '65px',
                    marginLeft: '0.5rem',
                }}
            />
          </div>
        )
    }    
    /********** FILTTERIT PÄÄTTYY ***********/
  
    // Generoidaan taulu lennossa oikean kokoseksi
    return (
        <table className="table" {...getTableProps()}>
            <thead>
                <tr>
                    <th
                    colSpan={visibleColumns.length}
                    style={{
                        textAlign: 'left',
                    }}
                    >
                    <GlobalFilter
                        preGlobalFilteredRows={preGlobalFilteredRows}
                        globalFilter={state.globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    </th>
                </tr>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                                <div>
                                    {column.canFilter ? column.render('Filter') : null}
                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
                
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
  }