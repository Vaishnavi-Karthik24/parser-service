import { create, eq } from 'lodash'
import {
  username,
  authRoute,
  rootUrl,
  url,
  apiRoot,
  password,
} from '../../../utils/cypressUtils'

describe('DML 2.0 Validation', () => {
  beforeEach(function () {
    cy.visit(rootUrl)
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('button').contains('Login').click()
    cy.wait(2000).url().should('eq', authRoute('/algorithms'))
    cy.visit(authRoute(`/results`))
  })
  it('Cypress test to verify all UI data from results tab', () => {
    let shapeName, created_date
    cy.task('queryTestDb', {
      query:
        "select * from vson.activation_data act inner join ems_details emsd on act.ems_name = emsd.ems_name where act.status = 'SUPPRESSED' and emsd.ems_vendor in ('samsung','ericsson') order by created_date desc limit 1",
    }).then((results) => {
      if (results[0].ems_vendor == 'samsung') {
        shapeName = results[0].ems_name
        created_date = results[0].created_date
        cy.log(shapeName)
        cy.get('.Select-clear').eq(1).click()
        cy.get('.Select-arrow').eq(1).click().type('Ems')
        cy.get('.Select-menu-outer').click()
        cy.get('.Select-placeholder').eq(0).type(`${shapeName}`)
        cy.get('.Select-menu-outer').click()
        const dayjs = require('dayjs')
        const todaysDate = dayjs().format('DD/MM/YYYY')
        const curDate = dayjs().format('YYYY-MM-DD')
        cy.log(curDate, 'curDate')
        cy.log(dayjs().format('DD/MM/YYYY'))
        var day = todaysDate.slice(0, 2).replace(/^0+/, '')
        cy.wait(2000)

        const previousDate = dayjs().add(-10, 'day').format('DD/MM/YYYY')
        cy.log(day)

        const month = todaysDate.slice(3, 5)
        var month_int = parseInt(month)
        var current_month_no = month_int - 1

        var months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]

        var selectedMonthName = months[current_month_no]
        cy.log(selectedMonthName)
        cy.log(month)
        const Year = todaysDate.slice(6, 10)
        cy.log(Year)
        const start_day = previousDate.slice(0, 2)
        const start_month = previousDate.slice(3, 5)
        var month_int = parseInt(start_month)
        var current_month_no = month_int - 1
        var dbselectedMonthName = months[current_month_no]
        const start_Year = previousDate.slice(6, 10)
        cy.scrollTo('top')
        cy.xpath(
          '//*[@class="react-daterange-picker__inputGroup"][1]/input[4]'
        ).click()
        cy.get(`[class="react-calendar__navigation__label"]`).click()
        cy.get(`[class="react-calendar__navigation__label"]`).click()
        cy.xpath(`//button[@type="button"][text()=${Year}]`).click()
        cy.xpath(`//*[text()='${dbselectedMonthName}']`).click()

        cy.get(
          `[aria-label= '${dbselectedMonthName} ${start_day}, ${start_Year}']`
        ).click()
        cy.get(`[class="react-calendar__navigation__label"]`).click()
        cy.xpath(`//*[text()='${selectedMonthName}']`).click()
        cy.wait(2000)
        cy.get(`[aria-label= '${selectedMonthName} ${day}, ${Year}']`).click({
          force: true,
        })
        cy.get('#results-search-btn-search').click()
        cy.get('.sc-bxivhb.irlKRw', { timeout: 80000 }).should('not.exist')
        cy.wait(2000)
        cy.get('i[id="overallImpact:false"]')
          .eq(0)
          .scrollIntoView({ offset: { left: 2500 } })
        cy.get('div[title="Not Approved"]').eq(0).prev('div').click()
        cy.get('#main-container').scrollIntoView({ offset: { Top: 3000 } })
        cy.get('select', { multiple: true }).select('Schedule')
        cy.wait(3000)
        cy.get('.col-md-12').eq(1).click()
        cy.get('h4').then(($h4) => {
          const h4Text = $h4.text().trim()
          cy.log(h4Text)
          if (h4Text.includes('Impact Warning')) {
            cy.get('[title="Continue Anyway"]').click()
          }
          cy.get('select:first').select('SCHEDULE_NOW')
          cy.get('#currentTime').select('OUTSIDE')
          cy.get('#checkbox1').click()
          cy.get('#checkbox2').click()
          cy.get('#checkbox3').click()
          cy.get('#reason').type('DML 2.0 Cypress Testing')
          cy.wait(1000)
          cy.get('button').eq(7).click()
          cy.wait(10000)
        })
        cy.visit(authRoute('/activationStatus'))
        cy.wait(5000)
        cy.get('.alert > ul > li').contains('DML is in Offline Mode')
        cy.wait(1000)
        cy.get('.Select-value-icon').eq(1).click()
        cy.wait(1000)
        cy.get('.Select-value-icon').eq(1).click()
        cy.wait(1000)
        cy.get('.ag-body-viewport').eq(0).click()
        cy.wait(1000)
        cy.log(shapeName, 'shapeName')
        cy.get(`#ems-${shapeName}-deletefalse`)
          .scrollIntoView({ easing: 'linear' })
          .click(0, 0, { force: true })
        created_date = created_date.slice(0, 10)
        cy.log(created_date, 'created date')
        cy.get('.form-control')
          .wait(1000)
          .dblclick()
          .wait(1000)
          .type(
            '{rightarrow}'.repeat(10) + '{backspace}'.repeat(10) + `${curDate}`
          )
        cy.wait(5000)
        cy.get('#searchButtonDefault').click()
        cy.wait(100000)
        cy.get('#refresh-btn-rows > .fa').click()
        cy.wait(2000)
        cy.get('#searchButtonDefault').click()
        cy.get('.ag-body-container').then(($element) => {
          cy.log($element)
          if ($element.find('div').length == 0) {
            cy.get('.ag-overlay-no-rows-center').should(
              'have.text',
              'No Rows To Show'
            )
          } else {
            cy.wait(40000)
            cy.get('.ag-react-container > a').eq(1).click()
            cy.wait(3000)
            cy.get(
              '[style="background-color: rgb(245, 245, 245); border: 1px solid rgb(220, 220, 220); border-radius: 5px; height: 440px; overflow: hidden;"] > :nth-child(1) > .nav > :nth-child(2) > a'
            ).click()
            cy.get('.accordion-toggle').contains('Complete').eq(0).click()
            // cy.get('div[class="panel-collapse collapse in"]').within(() => {
            //   cy.wait(1000)
            //   cy.get('.panel-body').invoke('text').then((text) => {
            //     cy.log(text)
            //     text.should('contains', 'SUCCESS')
            //   })
            // })
          }
        })
      } else if (results[0].ems_vendor == 'ericsson') {
        shapeName = results[0].ems_name
        created_date = results[0].created_date
        cy.log(shapeName)
        cy.get('.Select-clear').eq(1).click()
        cy.get('.Select-arrow').eq(1).click().type('Ems')
        cy.get('.Select-menu-outer').click()
        cy.get('.Select-placeholder').eq(0).type(`${shapeName}`)
        cy.get('.Select-menu-outer').click()
        const dayjs = require('dayjs')
        const todaysDate = dayjs().format('DD/MM/YYYY')
        const curDate = dayjs().format('YYYY-MM-DD')
        cy.log(curDate, 'curDate')
        cy.log(dayjs().format('DD/MM/YYYY'))
        const day = todaysDate.slice(0, 2)
        const previousDate = dayjs().add(-10, 'day').format('DD/MM/YYYY')
        cy.log(day)

        const month = todaysDate.slice(3, 5)
        var month_int = parseInt(month)
        var current_month_no = month_int - 1

        var months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]

        var selectedMonthName = months[current_month_no]
        cy.log(selectedMonthName)
        cy.log(month)
        const Year = todaysDate.slice(6, 10)
        cy.log(Year)
        const start_day = previousDate.slice(0, 2)
        const start_month = previousDate.slice(3, 5)
        var month_int = parseInt(start_month)
        var current_month_no = month_int - 1
        var dbselectedMonthName = months[current_month_no]
        const start_Year = previousDate.slice(6, 10)
        cy.scrollTo('top')
        cy.xpath(
          '//*[@class="react-daterange-picker__inputGroup"][1]/input[4]'
        ).click()
        cy.get(`[class="react-calendar__navigation__label"]`).click()
        cy.get(`[class="react-calendar__navigation__label"]`).click()
        cy.xpath(`//button[@type="button"][text()=${Year}]`).click()
        cy.xpath(`//*[text()='${dbselectedMonthName}']`).click()

        cy.get(
          `[aria-label= '${dbselectedMonthName} ${start_day}, ${start_Year}']`
        ).click()
        cy.get(`[class="react-calendar__navigation__label"]`).click()
        cy.xpath(`//*[text()='${selectedMonthName}']`).click()
        cy.wait(2000)
        cy.get(`[aria-label= '${selectedMonthName} ${day}, ${Year}']`).click({
          force: true,
        })
        cy.get('#results-search-btn-search').click()
        cy.get('.sc-bxivhb.irlKRw', { timeout: 80000 }).should('not.exist')
        cy.wait(2000)
        cy.get('i[id="overallImpact:false"]')
          .eq(0)
          .scrollIntoView({ offset: { left: 2500 } })
        cy.get('div[title="Not Approved"]').eq(0).prev('div').click()
        cy.get('#main-container').scrollIntoView({ offset: { Top: 3000 } })
        cy.get('select', { multiple: true }).select('Schedule')
        cy.wait(3000)
        cy.get('.col-md-12').eq(1).click()
        cy.get('h4').then(($h4) => {
          const h4Text = $h4.text().trim()
          cy.log(h4Text)
          if (h4Text.includes('Impact Warning')) {
            cy.get('[title="Continue Anyway"]').click()
          }
          cy.get('select:first').select('SCHEDULE_NOW')
          cy.get('#currentTime').select('OUTSIDE')
          cy.get('#checkbox1').click()
          cy.get('#checkbox2').click()
          cy.get('#checkbox3').click()
          cy.get('#reason').type('DML 2.0 Cypress Testing')
          cy.wait(1000)
          cy.get('button').eq(7).click()
          cy.wait(10000)
        })
        cy.visit(authRoute('/activationStatus'))
        cy.wait(5000)
        cy.get('.alert > ul > li').contains('DML is in Offline Mode')
        cy.wait(1000)
        cy.get('.Select-value-icon').eq(1).click()
        cy.wait(1000)
        cy.get('.ag-body-viewport').eq(0).click()
        cy.wait(10000)
        cy.get(`#ems-${shapeName}-deletefalse`)
          .scrollIntoView({ easing: 'linear' })
          .click()
        created_date = created_date.slice(0, 10)
        cy.log(created_date, 'created_date')
        cy.get('.form-control')
          .wait(1000)
          .dblclick()
          .wait(1000)
          .type(
            '{rightarrow}'.repeat(10) + '{backspace}'.repeat(10) + `${curDate}`
          )
        cy.wait(5000)
        cy.get('#searchButtonDefault').click()
        cy.wait(101000)
        cy.get('#refresh-btn-rows > .fa').click()
        cy.wait(2000)
        cy.get('#searchButtonDefault').click()
        cy.get('.ag-body-container').then(($element) => {
          cy.log($element)
          if ($element.find('div').length == 0) {
            cy.get('.ag-overlay-no-rows-center').should(
              'have.text',
              'No Rows To Show'
            )
          } else {
            cy.wait(40000)
            cy.get('.ag-react-container > a').eq(1).click()
            cy.wait(3000)
            cy.get(
              '[style="background-color: rgb(245, 245, 245); border: 1px solid rgb(220, 220, 220); border-radius: 5px; height: 440px; overflow: hidden;"] > :nth-child(1) > .nav > :nth-child(2) > a'
            ).click()
            cy.get('.accordion-toggle').contains('Complete').eq(0).click()
            // cy.get('div[class="panel-collapse collapse in"]').within(() => {
            //   cy.wait(1000)
            //   cy.get('.panel-body').invoke('text').then((text) => {
            //     cy.log(text)
            //     text.should('contains', 'SUCCESS')
            //   })
            // })
          }
        })
      }
    })
  })
})
