import React from 'react'
import ReactToPrint from "react-to-print";
import CetakTransaksi from './CetakTransaksi';
import axios from 'axios'

export default class  extends React.Component {
    constructor() {
        super()
    }
    render() {
        return (
         <div>
                                    <ReactToPrint
                                        trigger={() => <a class='btn btn-primary'>Print this out!</a>}
                                        content={() => this.componentRef}
                                        />
                                        <CetakTransaksi ref={el => (this.componentRef = el)} />
                                </div>
    
        )
    }
}