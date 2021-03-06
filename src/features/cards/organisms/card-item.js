/* eslint-disable react/prop-types */
import React, { useState } from "react"
import styled, { css } from "styled-components"
import PropTypes from "prop-types"
import { format } from "date-fns"
import { Link as RouterLink } from "react-router-dom"

import { RichEditor } from "@lib/rich-text"
import { Row } from "@lib/styled-components-layout"
import * as Menu from "@lib/context-menu"
import { CardNarrow, H2, Icon, Link, Modal, Text } from "@howtocards/ui"

export const CardItem = ({ onUsefulClick, card, maximized }) => (
  // preview-worker depends on card structure
  // https://github.com/howtocards/preview-worker#api
  <CardNarrow>
    <CardBox maximized={maximized}>
      <GridCard maximized={maximized}>
        <CellCardFlag>
          <CardFlagWithNumber
            usefulFor={card.usefulFor}
            isUseful={card.permissions.isUseful}
            onUsefulClick={() => onUsefulClick(card.id)}
          />
        </CellCardFlag>

        <CellCardHeader>
          <CardHeader card={card} />
        </CellCardHeader>

        <CellCardContent>
          <RichEditor readOnly content={card.content} />
        </CellCardContent>

        <CellCardFooter>
          <CardInfo createdAt={card.createdAt} />
          {/* <Link to="/">14 Comments</Link> */}
        </CellCardFooter>
      </GridCard>
    </CardBox>
  </CardNarrow>
)

CardItem.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    permissions: PropTypes.shape({
      canEdit: PropTypes.bool,
      isUseful: PropTypes.bool,
    }).isRequired,
  }).isRequired,
  onUsefulClick: PropTypes.func.isRequired,
  maximized: PropTypes.bool,
}

CardItem.defaultProps = {
  maximized: false,
}

const CardFlagWithNumber = ({ usefulFor, isUseful, onUsefulClick }) => (
  <div>
    <FavouriteButton onUsefulClick={onUsefulClick} isUseful={isUseful} />
    <UsefulForCount>
      {usefulFor === 0 ? (
        <BeFirst>Be first</BeFirst>
      ) : (
        <Link to="/" title="Users find it useful">
          {usefulFor}
        </Link>
      )}
    </UsefulForCount>
  </div>
)

const BeFirst = styled.div`
  font-size: 0.7em;
  opacity: 0.5;
`

CardFlagWithNumber.propTypes = {
  onUsefulClick: PropTypes.func.isRequired,
  usefulFor: PropTypes.number.isRequired,
  isUseful: PropTypes.bool.isRequired,
}

const favouriteTitle = (isUseful) =>
  isUseful ? "No longer useful to me" : "Useful to me"

const FavouriteButton = ({ isUseful, onUsefulClick }) => {
  return (
    <IconWrapper onClick={onUsefulClick} title={favouriteTitle(isUseful)}>
      {isUseful ? (
        <Icon name="bookmark-solid" fill="red" />
      ) : (
        <Icon name="bookmark-regular" />
      )}
    </IconWrapper>
  )
}

FavouriteButton.propTypes = {
  onUsefulClick: PropTypes.func.isRequired,
  isUseful: PropTypes.bool.isRequired,
}

const CardHeader = ({ card }) => (
  <HeadingLine>
    <Link to={`/open/${card.id}`}>
      <H2 narrow>{card.title}</H2>
    </Link>
    {card.permissions.canEdit && (
      <Row basis="25%" justify="flex-end" gap="1.4em" align="center">
        <Menu.Context
          trigger={<Icon name="dots-v" height="1.6rem" />}
          menu={({ close }) => (
            <>
              <Menu.Item
                as={RouterLink}
                to={`/edit/${card.id}`}
                onClick={close}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                as={RouterLink}
                to={`/card/${card.id}/delete`}
                onClick={close}
              >
                Delete
              </Menu.Item>
            </>
          )}
        />
      </Row>
    )}
  </HeadingLine>
)

const CardInfo = (card) => (
  <Row>
    <Text small>{format(new Date(card.createdAt), "HH:MM MM.DD.YYYY")}</Text>
  </Row>
)

const CardDeleteModalButton = ({ card }) => {
  const [opened, setOpened] = useState(false)
  const close = () => setOpened(() => false)
  const toggle = () => setOpened((isOpen) => !isOpen)

  return (
    <div>
      <ZeroButton onClick={toggle}>
        <Icon name="trash" height="1.6rem" />
      </ZeroButton>

      {opened && (
        <Modal onClose={close}>
          <div>Do you absolutely sure you want to delete card</div>
          <div>
            <b>&#8220; {card.title} &#8221; </b>?
          </div>
          <div>Just kidding we are archiving them anyway.</div>
        </Modal>
      )}
    </div>
  )
}

CardDeleteModalButton.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
}

const media = {
  mobile: "@media screen and (max-width: 500px)",
}

const CardBox = styled.article`
  box-sizing: border-box;
  overflow-y: hidden;
  padding: 2rem;

  ${media.mobile} {
    padding: 2rem 1rem;
  }
`

const GridCard = styled.div`
  display: grid;
  grid-template-areas:
    "flag header"
    "flag content"
    "flag footer";
  grid-template-rows: auto 14rem auto;
  grid-template-columns: 50px 1fr;
  grid-gap: 8px;

  ${(p) =>
    p.maximized &&
    css`
      grid-template-rows: auto 1fr auto;
    `}

  ${media.mobile} {
    grid-template-areas:
      "flag header"
      "content content"
      "footer footer";
  }
`

const HeadingLine = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  flex-shrink: 0;
  line-height: 2.4rem;

  ${H2} {
    margin: 0;
  }
`
const IconWrapper = styled.div`
  padding: 0 0.6rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
  }
`

const UsefulForCount = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
`
const CellCardFooter = styled.div`
  grid-area: footer;
  align-items: flex-end;
  line-height: 2.4rem;
  padding: 8px 0;

  ${media.mobile} {
    padding: 0;
  }
`

const CellCardFlag = styled.div`
  grid-area: flag;
`
const CellCardHeader = styled.div`
  grid-area: header;
`
const CellCardContent = styled.div`
  grid-area: content;
  overflow-y: hidden;
`

CardHeader.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    permissions: PropTypes.shape({
      canEdit: PropTypes.bool,
      isUseful: PropTypes.bool,
    }).isRequired,
  }).isRequired,
}

export const ZeroButton = styled.button`
  background-color: transparent;
  border: none;
`
