## Ma simanyihiin bracketyada
Waxaa lagu siiyay **function** kaas oo qaadanay backetyo
> "([{{})]}"
Soo saar in bracketyada ey isla egyihiin.
Tusaale

```javascript
  maSimanYihiin("({[})]") => true
```

```javascript
  maSimanYihiin("{]{{{{(((())))}}}}[[]") => false
```

```javascript
  maSimanYihiin("]]]()))}}}}{{{[[[") => false
```

```javascript
  maSimanYihiin("(}){[]{}") => true
```

