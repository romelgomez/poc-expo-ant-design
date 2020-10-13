import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import './App.css';
import {
  Table,
  Modal,
  Tag,
  Button,
  notification
} from 'antd';

// Services
import { invoicesRef, updateInvoiceStatus } from './invoices.service';

// Styles
import 'antd/es/table/style/css';
import 'antd/es/tag/style/css';
import 'antd/es/modal/style/css';
import 'antd/es/notification/style/css';

// https://www.npmjs.com/package/consola
import consola from 'consola';


interface Invoice {
  objID?: any;
  invoice_number: number;
  total: string;
  currency: string;
  invoice_date: string;
  due_date: string;
  vendor_name: string;
  remittance_address: string;
  status: string;
}


const { confirm } = Modal;

const columns = [
  {
    title: 'Invoice #',
    dataIndex: 'invoice_number'
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (tag: string) => (
      <span>
        {
          <Tag color={tag === 'pending' ? 'volcano' : 'green'} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        }
      </span>
    )
  },
  {
    title: 'Total',
    dataIndex: 'total'
  },
  {
    title: 'Currency',
    dataIndex: 'currency'
  },
  {
    title: 'Invoice Date',
    dataIndex: 'invoice_date'
  },
  {
    title: 'Due Date',
    dataIndex: 'due_date'
  },
  {
    title: 'Vendor',
    dataIndex: 'vendor_name'
  },
  {
    title: 'Remittance Address',
    dataIndex: 'remittance_address'
  },
  {
    title: 'Action',
    key: 'action',
    render: (_: any, invoice: Invoice) => {
      return (
        <span>
          <Button onClick={showConfirm(invoice)}>Approve</Button>
        </span>
      );
    }
  }
];


/**
 * showConfirm function is a closure that return a function that open an modal to Approve the invoice.
 */
function showConfirm(invoice: Invoice) {
  return () => {
    confirm({
      title: `Do you want to Approve the invoice #${invoice.invoice_number}?`,
      content: 'This action can\'t be rollback',
      onOk() {
        return new Promise((resolve, reject) => {

          updateInvoiceStatus(invoice.objID, 'Approved')
            .then(() => {

              notification.success({
                message: 'DONE',
                description: `The invoce #${invoice.invoice_number} was Approved!`,
              });

              resolve('');
              
            })
            .catch((reason) => {

              reject(reason);

            });

        })
        .catch(reason => {
          
          consola.error(new Error(reason.toString()))

        });
      },
      onCancel() { }
    });
  };
}


export default function App() {
  const __invoices: Invoice[] = [];

  const [invoices, setInvoices] = useState(__invoices);

  // componentDidMount
  useEffect(() => {

    invoicesRef
      .on('value', (snapshot) => {

        var objects = snapshot.val();
        var invoices: Invoice[] = [];

        for (var objID in objects) {
          if (objects.hasOwnProperty(objID)) {
            invoices.push({
              ...objects[objID],
              objID: objID
            });
          }
        }

        setInvoices(invoices);
      });

    return () => {
      // UNMOUNTED
      invoicesRef.off();
    };

  }, []);

  return (
    <div className='App'>
      <h3 style={{ marginBottom: 16 }}>2ulaundry</h3>
      <Table
        rowKey={record => record.objID}
        dataSource={invoices
          .filter((invoice: Invoice) => invoice.status === 'pending')
          .reverse()}
        columns={columns}
      />
    </div>
  );
  

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
