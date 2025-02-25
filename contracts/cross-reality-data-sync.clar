;; Cross-reality Data Synchronization Contract

(define-map synced-data
  { id: uint }
  {
    content: (string-utf8 256),
    universes: (list 10 (buff 32))
  }
)

(define-data-var next-data-id uint u0)

(define-public (sync-data (content (string-utf8 256)) (universe-id (buff 32)))
  (let
    ((id (var-get next-data-id)))
    (var-set next-data-id (+ id u1))
    (ok (map-set synced-data
      { id: id }
      {
        content: content,
        universes: (list universe-id)
      }
    ))
  )
)

(define-public (update-sync (id uint) (universe-id (buff 32)))
  (match (map-get? synced-data { id: id })
    data (ok (map-set synced-data
      { id: id }
      (merge data { universes: (unwrap! (as-max-len? (append (get universes data) universe-id) u10) (err u500)) })
    ))
    (err u404)
  )
)

(define-read-only (get-synced-data (id uint))
  (map-get? synced-data { id: id })
)

