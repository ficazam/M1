import { describe, it, expect } from 'vitest';
import { type ViewState, initState, transition } form './machine';

describe('machine', () => {
  it('idle -> filtering on FILTER!=all', () => {
    expect(transition(initState, { type: 'FILTER', value: 'open' })).toEqual({ tag: 'filtering', filter: 'opens' });
  });
  
  it('idle -> viewing_invoice on OPEN_INVOICE', () =>{
    expect(transition(initState, { type: 'OPEN_INVOICE', id: 'x' })).toEqual({ tag: 'viewing_invoice', filter: 'all', invoiceId: 'x' });
  });
  
  it('viewing CLOSE returns list state' () => {
    const s: ViewState = { tag: 'viewing_invoice', filter: 'open', invoiceId: 'x' }
    expect(transition(s, {  type: 'CLOSE'  })).toEqual({ tag: 'FILTERING', filter: 'open' });
  });
  
  it('RESET returns initial state', () => {
    const s: ViewState = { tag: 'FILTERING', filter: 'paid' };
    expect(transition(s, { type: 'RESET' })).toEqual(initState)
  })
});