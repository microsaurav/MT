import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Flex,
	Link,
	Text,
	useColorModeValue
  } from '@chakra-ui/react';
  import PropTypes from 'prop-types';
  import React, { useState, useEffect } from 'react';
  import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
  
  export default function AdminNavbar(props) {
	const [scrolled, setScrolled] = useState(false);
  
	useEffect(() => {
	  const changeNavbar = () => {
		setScrolled(window.scrollY > 1);
	  };
	  window.addEventListener('scroll', changeNavbar);
	  return () => window.removeEventListener('scroll', changeNavbar);
	}, []);
  
	const { secondary, message, brandText } = props;
  
	const mainText = useColorModeValue('navy.700', 'white');
	const secondaryText = useColorModeValue('gray.700', 'white');
	const navbarBg = useColorModeValue(
	  'rgba(244, 247, 254, 0.8)',
	  'rgba(11,20,55,0.8)'
	);
	
	let navbarPosition = 'fixed';
	let navbarFilter = 'none';
	let navbarBackdrop = 'blur(20px)';
	let navbarShadow = 'none';

	let navbarBorder = 'transparent';
	let secondaryMargin = '45px';
	let paddingX = '15px';
	let gap = '0px';
	return (
		<Box
		position={navbarPosition}
		boxShadow={navbarShadow}
		bg={navbarBg}
		borderColor={navbarBorder}
		filter={navbarFilter}
		backdropFilter={navbarBackdrop}
		backgroundPosition='center'
		backgroundSize='cover'
		borderRadius='16px'
		borderWidth='1.5px'
		borderStyle='solid'
		transitionDelay='0s, 0s, 0s, 0s'
		transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
		transition-property='box-shadow, background-color, filter, border'
		transitionTimingFunction='linear, linear, linear, linear'
		alignItems={{ xl: 'center' }}
		display={secondary ? 'block' : 'flex'}
		minH='75px'
		justifyContent={{ xl: 'center' }}
		lineHeight='25.6px'
		mx='auto'
		
		mt={secondaryMargin}
		pb='8px'
		right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
		px={{
			sm: paddingX,
			md: '10px'
		}}
		ps={{
			xl: '12px'
		}}
		pt='8px'
		top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
		w={{
			base: 'calc(100vw - 6%)',
			md: 'calc(100vw - 8%)',
			lg: 'calc(100vw - 6%)',
			xl: 'calc(100vw - 350px)',
			'2xl': 'calc(100vw - 365px)'
		}}>
		<Flex
		  w="100%"
		  flexDirection={{ base: 'column', md: 'row' }}
		  alignItems="center"
		>
		  <Box mb={{ base: '8px', md: '0' }}>
			<Breadcrumb>
			  <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
				<BreadcrumbLink href="#" color={secondaryText}>
				  Pages
				</BreadcrumbLink>
			  </BreadcrumbItem>
			  <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
				<BreadcrumbLink href="#" color={secondaryText}>
				  {brandText}
				</BreadcrumbLink>
			  </BreadcrumbItem>
			</Breadcrumb>
			<Link
			  color={mainText}
			  href="#"
			  fontWeight="bold"
			  fontSize="34px"
			  _hover={{ color: mainText }}
			  _active={{ borderColor: 'transparent' }}
			  _focus={{ boxShadow: 'none' }}
			>
			  {brandText}
			</Link>
		  </Box>
		  <Box ms="auto" w={{ base: '100%', md: 'unset' }}>
			<AdminNavbarLinks
			  onOpen={props.onOpen}
			  logoText={props.logoText}
			  secondary={props.secondary}
			  fixed={props.fixed}
			  scrolled={scrolled}
			/>
		  </Box>
		</Flex>
		{secondary && <Text color="white">{message}</Text>}
	  </Box>
	);
  }
  
  AdminNavbar.propTypes = {
	brandText: PropTypes.string,
	variant: PropTypes.string,
	secondary: PropTypes.bool,
	fixed: PropTypes.bool,
	onOpen: PropTypes.func,
	message: PropTypes.string
  };
  