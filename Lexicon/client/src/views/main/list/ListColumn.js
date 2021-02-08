import React from 'react'
import ListControls from '../../../components/lists/ListControls'
import ListCardContainer from '../../../components/lists/ListCardContainer'
import { CollectionManagerCreateRoute } from '../../../utils/Routes'

const ListColumn = ({
    history,
    searchTerms,
    setSearchTerms,
    AppSelectedRoute,
    isFetchingCollections,
    collections }) => (
    <>
        <ListControls
            history={history}
            setSearchTerms={setSearchTerms}
            formUrlToPushTo={CollectionManagerCreateRoute}
            createNewString={'collection'} />

        <ListCardContainer
            history={history}
            searchTerms={searchTerms}
            urlToPushTo={AppSelectedRoute}
            isFetching={isFetchingCollections}
            items={collections}  />
    </>
)

export default ListColumn