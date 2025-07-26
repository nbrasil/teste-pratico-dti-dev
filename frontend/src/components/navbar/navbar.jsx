import styles from './navbar.module.css';
import { LuShoppingCart, LuUserRound, LuMenu } from "react-icons/lu";
import { Drawer } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {

  const [openMenu, setOpenMenu] = useState(false) /*inicializa como false*/ 

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu) /*no momento que clicar ele transforma false em true e vice versa*/ 
  }

  return (
    <nav className={styles.navbarContainer}>
        <div className={styles.navbarItems}>
          <Link to={'/'}>
            <img className={styles.logo} src="/logo.png" alt="logo do restaurante" />
          </Link>
            <div className={styles.navbarLinksContainer}>
                <Link to={'/'} className={styles.navbarLink}>Home</Link>
                <Link to={'/plates'} className={styles.navbarLink}>Plates</Link> 
                <Link to={'/cart'}>
                  <LuShoppingCart className={styles.navbarLink} />
                </Link>
                <Link to={'/profile'}>
                  <LuUserRound className={styles.navbarLink} />
                </Link>
                
                
            </div>
        </div>


        {/* Mobile Navbar */}

        <div className={styles.mobileNavbarItems}>
          <Link to={'/'}>
            <img className={styles.logo} src="/logo.png" alt="logo do restaurante" />
          </Link>
            <div className={styles.mobileNavbarBtns}>
              <Link to={'/cart'}>
                <LuShoppingCart className={styles.navbarLink} />
              </Link>
              <LuMenu className={styles.navbarLink} onClick={handleOpenMenu}/>

              
              
            </div>
        </div>
        
        <Drawer 
          anchor="right"
          open={openMenu}
          onClose={handleOpenMenu}
        >
          <div className={styles.drawer}>
            <Link to={'/'} className={styles.navbarLink}>Home</Link>
            <Link to={'/plates'} className={styles.navbarLink}>Plates</Link> 
            <Link to={'/profile'} className={styles.navbarLink}>Profile</Link>
          </div>

        </Drawer>


    </nav>
  ) 
}
   