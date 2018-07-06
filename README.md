translationCore
=====
This project's goal is to provide in depth checking tools for Bible translation.
Instead of just checking verse by verse with many things to consider at once, it is checking one type at a time, going through the whole bible… a pivot on the checking process.

This will provide quantifiable and measurable quality of the translation output.

All of the checking tools are extracted from the translation notes that are made for each verse to ensure that the information is available to the translators while translating.

translationCore Proof of Concept
-----
Focused Proof of Concept of translationCore to be produced just for Metaphors & Ephesians.

Key Results
-----
- Display translationAcademy module (collapsible)
- Parse translationNotes and extract Metaphor links
- Live import from ufW of uGNT and GL (ULB)
- Live import from d43 repo content of OL (fr or pt-br)
- Display tN note from the specific parsed verse reference
- Display verse of uGNT, GL (ULB), and OL (fr/pt-br)
- Highlight the quote from the tN note in the GL (ULB)
- Menu to show all references of the check and status
- Next and Previous take you to the next item to check not the next verse
- Form options for "Flag for review," "Figure retained," and "Figure removed"
- Required Text box to paste the quote for tagging the check

Stretch Goals
-----
- Allow scrolling of verses for context
- Alert if the quote is not found in the OL when pasting in the quote input box
- Provide optional comments box for translators to make notes

Sources/Input for Proof of Concept
-----
- tA module for Metaphor (& Figures of Speech?)
 - https://door43.org/_export/xhtmlbody/en/ta/vol1/translate/figs_metaphor
- tN for all metaphors in Ephesians
 - https://github.com/Door43/d43-en/tree/master/bible/notes/eph
- uGNT
 - https://raw.githubusercontent.com/toddlprice/Unlocked-Greek-New-Testament/master/greek_WH_UBS4_parsed_utf8.txt
- ULB book of Ephesians
 - https://api.unfoldingword.org/ulb/txt/1/ulb-en/50-EPH.usfm
 - Convert into JSON
- Other Language Bible, pt-br ULB
 - https://git.door43.org/BrainT/ULB-pt-br/raw/master/50-EPH.usfm
 - Convert into JSON
- UI to bring all items together

Output from Proof of Concept
-----
- Flags, Figure Retained, Figure Replaced
- Quote Phrase Used (button to copy/paste selected text)
- Comments (optional stretch goal)

