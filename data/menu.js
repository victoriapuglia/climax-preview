/* =====================================================================
   CLIMAX — MENU
   Add the real menu here. Nothing below is invented: the lists are empty
   until the owner sends dishes and prices.

   Each item:  { name: "Grilled tilapia", description: "With chips", price: 35000 }
     • price is in Ugandan shillings, numbers only (35000, not "35,000")
     • price: null shows "Ask staff"
     • sold out today?  add  soldOut: true
   Categories with no items are hidden. Update lastUpdated when you edit.
   ===================================================================== */
window.CLIMAX = window.CLIMAX || {};

CLIMAX.menu = {
  lastUpdated: "",
  categories: [
    { id: "kitchen",   title: "From the kitchen", items: [] },
    { id: "grill",     title: "From the grill",   items: [] },
    { id: "cocktails", title: "Cocktails",        items: [] },
    { id: "bar",       title: "Beer, wine & spirits", items: [] },
    { id: "soft",      title: "Soft drinks & coffee", items: [] }
  ]
};
