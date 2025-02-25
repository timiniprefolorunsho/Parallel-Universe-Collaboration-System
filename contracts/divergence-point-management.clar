;; Divergence Point Management Contract

(define-map divergence-points
  { id: uint }
  {
    description: (string-utf8 256),
    universes: (list 10 (buff 32))
  }
)

(define-data-var next-point-id uint u0)

(define-public (register-divergence (description (string-utf8 256)) (universe-id (buff 32)))
  (let
    ((id (var-get next-point-id)))
    (var-set next-point-id (+ id u1))
    (ok (map-set divergence-points
      { id: id }
      {
        description: description,
        universes: (list universe-id)
      }
    ))
  )
)

(define-public (add-affected-universe (id uint) (universe-id (buff 32)))
  (match (map-get? divergence-points { id: id })
    point (ok (map-set divergence-points
      { id: id }
      (merge point { universes: (unwrap! (as-max-len? (append (get universes point) universe-id) u10) (err u500)) })
    ))
    (err u404)
  )
)

(define-read-only (get-divergence-point (id uint))
  (map-get? divergence-points { id: id })
)

