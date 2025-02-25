;; Inter-universal Identification Contract

(define-map universes
  { id: (buff 32) }
  { name: (string-ascii 64) }
)

(define-public (register-universe (name (string-ascii 64)))
  (let
    ((id (sha256 (unwrap-panic (to-consensus-buff? name)))))
    (asserts! (is-none (map-get? universes { id: id })) (err u403))
    (ok (map-set universes { id: id } { name: name }))
  )
)

(define-read-only (get-universe (id (buff 32)))
  (map-get? universes { id: id })
)

