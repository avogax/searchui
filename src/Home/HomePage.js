import { Input } from '@rebass/forms/styled-components'
import { Suspense } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useHistory } from 'react-router-dom/index'

import Spinner from '../App/Spinner'
import { Link, Heading, Flex, Button, Box, Text } from '../Primitives'
import SourceList from './List.js'

function HomePage() {
  const history = useHistory()

  function handleSubmit(evt) {
    evt.preventDefault()
    const param = new URLSearchParams(new FormData(evt.target))
    history.push(`/search/?${param}`)
  }

  return (
    <>
      <Heading as="h1" variant="display">
        European Photon and Neutron Open Data Search Portal
      </Heading>
      <Box as="form" action="/search" onSubmit={handleSubmit} sx={{ my: 4 }}>
        <Text as="p" sx={{ mt: 0, mb: 2, fontStyle: 'italic' }}>
          Type a query to search for open data from photon and neutron sources
          &ndash; e.g. data
        </Text>
        <Flex
          sx={{
            alignSelf: 'center',
            flex: '1 1 0%',
            maxWidth: '30rem',
            fontSize: 3,
          }}
        >
          <Input name="q" mr={2} placeholder="diffraction" />
          <Button aria-label="Search" type="submit">
            <FiSearch />
          </Button>
        </Flex>
      </Box>
      <p>
        The European Photon and Neutron sources are working together in the{' '}
        <Link href="https://www.panosc.eu/" blank>
          PaNOSC
        </Link>{' '}
        and{' '}
        <Link href="https://expands.eu/" blank>
          ExPaNDS
        </Link>{' '}
        projects financed by the European Commission to build the{' '}
        <strong>European Open Science Cloud</strong>. One of the main objectives
        of the EOSC is to make <strong>Open Data</strong> from these facilities{' '}
        <abbr title="Findable, Accessible, Interoperable, Reusable">FAIR</abbr>.
        This portal implements the F(indable) part of FAIR via a{' '}
        <strong>federated search engine</strong> from the following facilities:
      </p>
      <Suspense fallback={<Spinner />}>
        <SourceList />
      </Suspense>
      <p>
        Additional facilities will be included in the federated search as their
        search engines come online locally. The goal is to include all photon
        and neutron facilites who provide open data by the end of the two
        projects PaNOSC and ExPaNDS.
      </p>
      <p>
        The mission of the PaN data search portal is to contribute to the
        realization of a data commons for Neutron and Photon science. The search
        results provide a link to the landing page of the data DOIs through
        which the other data services provided by PaNOSC and ExPaNDS for data
        downloading, analysis, notebooks and simulation can be accessed. The aim
        of the portal is to facilitate using data from photon and neutron
        sources for the many scientists from existing and future disciplines. To
        achieve this aim, the exchange of know-how and experiences is crucial to
        driving a change in culture by embracing Open Science among the targeted
        scientific communities. This is why the project works closely with the
        national photon and neutron sources in Europe to develop common
        policies, strategies and solutions in the area of FAIR data policy, data
        management and data services.
      </p>
    </>
  )
}

export default HomePage
