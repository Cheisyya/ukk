import Login from './Pages/Login'
import User from './Pages/User'
import Dashboard from './Pages/Dashboard'
import Transaksi from './Pages/Transaksi'
import Profile from './Pages/Profile'
import Meja from './Pages/Meja'
import FormTransaksi from './Pages/FormTransaksi'
import DetailTransaksi from './Pages/DetailTransaksi'
import CetakTransaksi from './Pages/CetakTransaksi'
import Cart from './Pages/Cart'
import TransaksiKasir from './Pages/TransaksiKasir'
import Menu from './Pages/Menu'
import FilterBulanan from './Pages/FilterBulanan'
import SelectMeja from './Pages/SelectMeja'
import SelectMenu from './Pages/SelectMenu'
import DetailKasir from './Pages/DetailTransaksiKasir'
import PrintTransaksi from './Pages/PrintTransaksi'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/user" component={User} />
      <Route path="/meja" component={Meja} />
      <Route path="/transaksi" component={Transaksi} />
      <Route path="/formtransaksi" component={FormTransaksi} />
      <Route path="/detailtransaksi" component={DetailTransaksi} />
      <Route path="/cetaktransaksi" component={CetakTransaksi} />
      <Route path="/transaksikasir" component={TransaksiKasir} />
      <Route path="/cart" component={Cart} />
      <Route path="/profile" component={Profile} />
      <Route path="/menu" component={Menu} />
      <Route path="/filterbulanan" component={FilterBulanan} />
      <Route path="/selectmeja" component={SelectMeja} />
      <Route path="/selectmenu" component={SelectMenu} />
      <Route path="/detailkasir" component={DetailKasir} />
      <Route path="/printtransaksi" component={PrintTransaksi} />
    </Switch>
    </BrowserRouter>
  );
}

export default App;